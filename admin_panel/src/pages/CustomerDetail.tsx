import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
  IndianRupee,
  Receipt,
  UserX,
  UserCheck,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { customerById } from '@/data/customers';
import { orders } from '@/data/orders';
import type { CustomerStatus } from '@/types';
import { ORDER_STATUS_META } from '@/types';
import { formatCurrency, formatDate, timeAgo } from '@/lib/format';

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customerId ? customerById(customerId) : undefined;

  const [status, setStatus] = useState<CustomerStatus>(customer?.status ?? 'active');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const customerOrders = useMemo(
    () => orders.filter((o) => o.customerId === customerId),
    [customerId],
  );

  if (!customer) {
    return (
      <div>
        <Link to="/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
          <ArrowLeft size={15} /> Back to customers
        </Link>
        <Card>
          <EmptyState
            icon={<Users size={24} />}
            title="Customer not found"
            description="This customer may have been removed or the link is incorrect."
            action={
              <Link to="/customers">
                <Button variant="outline">Go to customers</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  return (
    <div>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        subtitle={`Customer · ${customer.city}`}
        actions={
          status === 'blocked' ? (
            <Button variant="primary" icon={<UserCheck size={16} />} onClick={() => setStatus('active')}>
              Unblock
            </Button>
          ) : (
            <Button variant="danger" icon={<UserX size={16} />} onClick={() => setConfirmOpen(true)}>
              Block
            </Button>
          )
        }
      />

      <Card>
        <CardBody className="flex flex-wrap items-start gap-6">
          <Avatar name={customer.name} color={customer.avatarColor} size={64} />
          <div className="min-w-[220px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-ink-900">{customer.name}</h2>
              <StatusBadge status={status} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Mail size={14} className="text-ink-400" /> {customer.email}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Phone size={14} className="text-ink-400" /> {customer.phone}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <MapPin size={14} className="text-ink-400" /> {customer.city}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Calendar size={14} className="text-ink-400" /> Joined {formatDate(customer.joinedAt)}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Clock size={14} className="text-ink-400" /> Last order {timeAgo(customer.lastOrderAt)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total orders"
          value={customer.totalOrders}
          icon={<ShoppingBag size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
        />
        <StatCard
          label="Total spent"
          value={formatCurrency(customer.totalSpent)}
          icon={<IndianRupee size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Avg order value"
          value={formatCurrency(avgOrderValue)}
          icon={<Receipt size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
      </div>

      <Card className="mt-5">
        <CardBody className="border-b border-ink-100 py-4">
          <h3 className="font-display text-[15px] font-semibold text-ink-900">Order history</h3>
        </CardBody>
        {customerOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={22} />}
            title="No orders yet"
            description="This customer hasn't placed any orders."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Order</Th>
                <Th>Vendor</Th>
                <Th>Items</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
                <Th>Placed</Th>
              </Tr>
            </Thead>
            <tbody>
              {customerOrders.map((o) => (
                <Tr key={o.id}>
                  <Td>
                    <Link to={`/orders/${o.id}`} className="font-semibold text-ink-800 hover:text-brand-700">
                      {o.id}
                    </Link>
                  </Td>
                  <Td>{o.vendorName}</Td>
                  <Td className="text-ink-600">{o.itemsCount}</Td>
                  <Td className="text-right font-semibold text-ink-800">{formatCurrency(o.total)}</Td>
                  <Td>
                    <StatusBadge status={o.status} label={ORDER_STATUS_META[o.status].label} />
                  </Td>
                  <Td className="text-ink-500">{formatDate(o.placedAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Block this customer?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setStatus('blocked');
                setConfirmOpen(false);
              }}
            >
              Block customer
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          {customer.name} will no longer be able to place orders on Verdant until unblocked.
        </p>
      </Modal>
    </div>
  );
}
