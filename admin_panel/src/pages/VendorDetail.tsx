import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  IndianRupee,
  ShoppingBag,
  Package,
  Percent,
  CheckCircle2,
  XCircle,
  Ban,
  Store,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { vendorById } from '@/data/vendors';
import { products } from '@/data/products';
import { orders } from '@/data/orders';
import { vendorSettlements } from '@/data/settlements';
import type { Vendor } from '@/types';
import { ORDER_STATUS_META } from '@/types';
import { formatCurrency, formatDate, timeAgo } from '@/lib/format';

const ROW_CAP = 15;

export function VendorDetail() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | undefined>(() => (vendorId ? vendorById(vendorId) : undefined));
  const [activeTab, setActiveTab] = useState('products');
  const [suspendOpen, setSuspendOpen] = useState(false);

  const vendorProducts = useMemo(() => products.filter((p) => p.vendorId === vendorId), [vendorId]);
  const vendorOrders = useMemo(() => orders.filter((o) => o.vendorId === vendorId), [vendorId]);
  const vendorPayouts = useMemo(() => vendorSettlements.filter((s) => s.vendorId === vendorId), [vendorId]);

  if (!vendor) {
    return (
      <div>
        <Link to="/vendors" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700">
          <ArrowLeft size={16} />
          Back to vendors
        </Link>
        <EmptyState
          icon={<Store size={24} />}
          title="Vendor not found"
          description="This vendor may have been removed or the link is incorrect."
          action={
            <Link to="/vendors">
              <Button variant="outline">Back to vendors</Button>
            </Link>
          }
        />
      </div>
    );
  }

  function approve() {
    setVendor((v) => (v ? { ...v, status: 'active' } : v));
  }

  function reject() {
    setVendor((v) => (v ? { ...v, status: 'rejected' } : v));
  }

  function confirmSuspend() {
    setVendor((v) => (v ? { ...v, status: 'suspended' } : v));
    setSuspendOpen(false);
  }

  const tabItems: TabItem[] = [
    { value: 'products', label: 'Products', count: vendorProducts.length },
    { value: 'orders', label: 'Orders', count: vendorOrders.length },
    { value: 'settlements', label: 'Settlements', count: vendorPayouts.length },
  ];

  return (
    <div>
      <Link to="/vendors" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700">
        <ArrowLeft size={16} />
        Back to vendors
      </Link>

      <PageHeader title={vendor.storeName} subtitle={`Vendor ID: ${vendor.id}`} />

      <Card className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={vendor.storeName} color={vendor.avatarColor} size={64} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-ink-900">{vendor.storeName}</h2>
                <StatusBadge status={vendor.status} />
                <StatusBadge status={vendor.kycStatus} />
              </div>
              <p className="mt-1 text-sm text-ink-500">{vendor.ownerName} · {vendor.category}</p>
              <div className="mt-3 flex flex-col gap-1.5 text-[13px] text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-ink-400" />
                  {vendor.address}, {vendor.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={14} className="text-ink-400" />
                  GST: {vendor.gstNumber}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-ink-400" />
                  Joined {formatDate(vendor.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {vendor.status === 'pending' && (
              <>
                <Button variant="primary" icon={<CheckCircle2 size={16} />} onClick={approve}>
                  Approve vendor
                </Button>
                <Button variant="danger" icon={<XCircle size={16} />} onClick={reject}>
                  Reject vendor
                </Button>
              </>
            )}
            {vendor.status === 'active' && (
              <Button variant="danger" icon={<Ban size={16} />} onClick={() => setSuspendOpen(true)}>
                Suspend vendor
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total orders"
          value={vendor.totalOrders.toLocaleString('en-IN')}
          icon={<ShoppingBag size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(vendor.revenue)}
          icon={<IndianRupee size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Products listed"
          value={vendor.productsCount}
          icon={<Package size={18} />}
          iconColor="#7C3AED"
          iconSurface="var(--color-violet-surface)"
        />
        <StatCard
          label="Commission rate"
          value={`${vendor.commissionRate}%`}
          icon={<Percent size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
      </div>

      <Card className="mt-5">
        <CardHeader title="Vendor activity" subtitle="Products, recent orders and settlement history" />
        <div className="border-b border-ink-100 px-5 py-4">
          <Tabs items={tabItems} value={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === 'products' && (
          vendorProducts.length === 0 ? (
            <EmptyState icon={<Package size={22} />} title="No products listed" description="This vendor hasn't added any products yet." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <tbody>
                {vendorProducts.slice(0, ROW_CAP).map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-800">{p.name}</p>
                          <p className="text-[12px] text-ink-500">{p.unit}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">{p.categoryName}</Td>
                    <Td className="font-semibold text-ink-800">{formatCurrency(p.sellingPrice)}</Td>
                    <Td>{p.stock}</Td>
                    <Td>
                      <StatusBadge status={p.status} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )
        )}

        {activeTab === 'orders' && (
          vendorOrders.length === 0 ? (
            <EmptyState icon={<ShoppingBag size={22} />} title="No orders yet" description="This vendor has no orders on record." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                  <Th>Placed</Th>
                </Tr>
              </Thead>
              <tbody>
                {vendorOrders.slice(0, ROW_CAP).map((o) => (
                  <Tr key={o.id}>
                    <Td>
                      <Link to={`/orders/${o.id}`} className="font-semibold text-ink-800 hover:text-brand-700">
                        {o.id}
                      </Link>
                    </Td>
                    <Td>{o.customerName}</Td>
                    <Td>
                      <StatusBadge status={o.status} label={ORDER_STATUS_META[o.status].label} />
                    </Td>
                    <Td className="font-semibold text-ink-800">{formatCurrency(o.total)}</Td>
                    <Td className="text-ink-500">{timeAgo(o.placedAt)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )
        )}

        {activeTab === 'settlements' && (
          vendorPayouts.length === 0 ? (
            <EmptyState icon={<IndianRupee size={22} />} title="No settlements yet" description="No payout history for this vendor." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Period</Th>
                  <Th>Gross sales</Th>
                  <Th>Commission</Th>
                  <Th>Net payout</Th>
                  <Th>Status</Th>
                  <Th>Due date</Th>
                </Tr>
              </Thead>
              <tbody>
                {vendorPayouts.slice(0, ROW_CAP).map((s) => (
                  <Tr key={s.id}>
                    <Td className="whitespace-nowrap">{s.periodLabel}</Td>
                    <Td>{formatCurrency(s.grossSales)}</Td>
                    <Td>{formatCurrency(s.commission)} <span className="text-ink-400">({s.commissionRate}%)</span></Td>
                    <Td className="font-semibold text-ink-800">{formatCurrency(s.netPayout)}</Td>
                    <Td>
                      <StatusBadge status={s.status} />
                    </Td>
                    <Td className="text-ink-500">{formatDate(s.dueDate)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )
        )}
      </Card>

      <Modal
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title="Suspend vendor?"
        footer={
          <>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmSuspend}>
              Suspend vendor
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          {vendor.storeName} will be suspended immediately and removed from the storefront until reinstated. This
          action can be reversed later.
        </p>
      </Modal>
    </div>
  );
}
