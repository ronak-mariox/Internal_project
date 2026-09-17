import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Bike,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  CheckCircle2,
  IndianRupee,
  ShieldOff,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { driverById } from '@/data/drivers';
import { orders } from '@/data/orders';
import { driverPayouts } from '@/data/settlements';
import type { DriverStatus } from '@/types';
import { ORDER_STATUS_META } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';

export function DriverDetail() {
  const { driverId } = useParams<{ driverId: string }>();
  const driver = driverId ? driverById(driverId) : undefined;

  const [status, setStatus] = useState<DriverStatus>(driver?.status ?? 'offline');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'payouts'>('deliveries');

  const driverOrders = useMemo(
    () => orders.filter((o) => o.driverId === driverId).slice(0, 25),
    [driverId],
  );
  const payouts = useMemo(
    () => driverPayouts.filter((p) => p.driverId === driverId),
    [driverId],
  );

  if (!driver) {
    return (
      <div>
        <Link to="/drivers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
          <ArrowLeft size={15} /> Back to delivery partners
        </Link>
        <Card>
          <EmptyState
            icon={<Bike size={24} />}
            title="Delivery partner not found"
            description="This driver may have been removed or the link is incorrect."
            action={
              <Link to="/drivers">
                <Button variant="outline">Go to delivery partners</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const tabItems: TabItem[] = [
    { value: 'deliveries', label: 'Recent Deliveries', count: driverOrders.length },
    { value: 'payouts', label: 'Payouts', count: payouts.length },
  ];

  return (
    <div>
      <Link to="/drivers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back to delivery partners
      </Link>

      <PageHeader
        title={driver.name}
        subtitle={`Delivery partner · ${driver.zone}`}
        actions={
          status === 'suspended' ? (
            <Button variant="primary" icon={<UserCheck size={16} />} onClick={() => setStatus('online')}>
              Reactivate
            </Button>
          ) : (
            <Button variant="danger" icon={<ShieldOff size={16} />} onClick={() => setConfirmOpen(true)}>
              Suspend
            </Button>
          )
        }
      />

      <Card>
        <CardBody className="flex flex-wrap items-start gap-6">
          <Avatar name={driver.name} color={driver.avatarColor} size={64} />
          <div className="min-w-[220px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-ink-900">{driver.name}</h2>
              <StatusBadge status={status} />
              <StatusBadge status={driver.kycStatus} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Phone size={14} className="text-ink-400" /> {driver.phone}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Mail size={14} className="text-ink-400" /> {driver.email}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <MapPin size={14} className="text-ink-400" /> {driver.zone}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Bike size={14} className="text-ink-400" />
                <span className="capitalize">{driver.vehicleType}</span> · {driver.vehicleNumber}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-600">
                <Calendar size={14} className="text-ink-400" /> Joined {formatDate(driver.joinedAt)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total deliveries"
          value={driver.totalDeliveries}
          icon={<Package size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
        />
        <StatCard
          label="Completion rate"
          value={`${driver.completionRate}%`}
          icon={<CheckCircle2 size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Rating"
          value={driver.rating}
          icon={<Star size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Earnings this month"
          value={formatCurrency(driver.earningsThisMonth)}
          icon={<IndianRupee size={18} />}
          iconColor="#7C3AED"
          iconSurface="var(--color-violet-surface)"
        />
      </div>

      <div className="mt-5">
        <Tabs items={tabItems} value={activeTab} onChange={(v) => setActiveTab(v as 'deliveries' | 'payouts')} />
      </div>

      <Card className="mt-4">
        {activeTab === 'deliveries' ? (
          driverOrders.length === 0 ? (
            <EmptyState icon={<Package size={22} />} title="No deliveries yet" description="This driver hasn't been assigned any orders." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Vendor</Th>
                  <Th>Status</Th>
                  <Th>Placed</Th>
                </Tr>
              </Thead>
              <tbody>
                {driverOrders.map((o) => (
                  <Tr key={o.id}>
                    <Td>
                      <Link to={`/orders/${o.id}`} className="font-semibold text-ink-800 hover:text-brand-700">
                        {o.id}
                      </Link>
                    </Td>
                    <Td>{o.customerName}</Td>
                    <Td>{o.vendorName}</Td>
                    <Td>
                      <StatusBadge status={o.status} label={ORDER_STATUS_META[o.status].label} />
                    </Td>
                    <Td className="text-ink-500">{formatDateTime(o.placedAt)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )
        ) : payouts.length === 0 ? (
          <EmptyState icon={<IndianRupee size={22} />} title="No payouts yet" description="Payout history will appear here once generated." />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Period</Th>
                <Th>Deliveries</Th>
                <Th>Base earnings</Th>
                <Th>Incentives</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Due date</Th>
              </Tr>
            </Thead>
            <tbody>
              {payouts.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-medium text-ink-700">{p.periodLabel}</Td>
                  <Td>{p.deliveries}</Td>
                  <Td>{formatCurrency(p.baseEarnings)}</Td>
                  <Td>{formatCurrency(p.incentives)}</Td>
                  <Td className="font-semibold text-ink-800">{formatCurrency(p.totalPayout)}</Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                  <Td className="text-ink-500">{formatDate(p.dueDate)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Suspend delivery partner?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setStatus('suspended');
                setConfirmOpen(false);
              }}
            >
              Suspend partner
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          {driver.name} will be blocked from accepting new deliveries until reactivated. This action can be
          undone at any time.
        </p>
      </Modal>
    </div>
  );
}
