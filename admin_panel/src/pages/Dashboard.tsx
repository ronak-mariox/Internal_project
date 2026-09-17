import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Activity,
  Receipt,
  Store,
  Bike,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { RevenueTrendChart } from '@/components/charts/RevenueTrendChart';
import { CategoryRevenueChart } from '@/components/charts/CategoryRevenueChart';
import { dashboardKpis, last30DaysRevenue, ordersByStatus, revenueByCategory, topVendorsByRevenue } from '@/data/dashboard';
import { orders } from '@/data/orders';
import { ORDER_STATUS_META, type OrderStatus } from '@/types';
import { formatCurrency, timeAgo } from '@/lib/format';

const STATUS_ORDER: OrderStatus[] = [
  'new', 'preparing', 'quality-check', 'packing', 'ready-for-dispatch', 'dispatched', 'completed', 'cancelled', 'failed',
];

export function Dashboard() {
  const kpis = dashboardKpis();
  const trend = last30DaysRevenue();
  const statusCounts = ordersByStatus();
  const categoryRevenue = revenueByCategory();
  const topVendors = topVendorsByRevenue(5);
  const recentOrders = orders.slice(0, 6);
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Platform overview across orders, vendors, delivery partners and customers"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={<IndianRupee size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
          trend={12.4}
          trendLabel="vs last month"
        />
        <StatCard
          label="Total orders"
          value={kpis.totalOrders}
          icon={<ShoppingBag size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
          trend={8.1}
        />
        <StatCard
          label="Active orders"
          value={kpis.activeOrders}
          icon={<Activity size={18} />}
          iconColor="#0891B2"
          iconSurface="var(--color-teal-surface)"
        />
        <StatCard
          label="Avg. order value"
          value={formatCurrency(kpis.avgOrderValue)}
          icon={<Receipt size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
          trend={-2.3}
        />
        <StatCard
          label="Active vendors"
          value={`${kpis.activeVendors}/${kpis.totalVendors}`}
          icon={<Store size={18} />}
          iconColor="#7C3AED"
          iconSurface="var(--color-violet-surface)"
          trendLabel={`${kpis.pendingVendorApprovals} pending approval`}
        />
        <StatCard
          label="Drivers online"
          value={`${kpis.onlineDrivers}/${kpis.totalDrivers}`}
          icon={<Bike size={18} />}
          iconColor="#4338CA"
          iconSurface="var(--color-indigo-surface)"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue trend" subtitle="Last 30 days, completed orders" />
          <CardBody className="pl-0 pr-4">
            <RevenueTrendChart data={trend} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Order pipeline" subtitle={`${orders.length} orders total`} />
          <CardBody className="space-y-3">
            {STATUS_ORDER.map((status) => {
              const count = statusCounts[status] ?? 0;
              const meta = ORDER_STATUS_META[status];
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-ink-700">{meta.label}</span>
                    <span className="text-ink-500">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(count / maxStatusCount) * 100}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue by category"
            subtitle="Which catalog categories drive the most sales"
          />
          <CardBody>
            <CategoryRevenueChart data={categoryRevenue} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Top vendors"
            action={
              <Link to="/vendors" className="flex items-center gap-1 text-[12.5px] font-semibold text-brand-700 hover:underline">
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <CardBody className="space-y-4">
            {topVendors.map((vendor, i) => (
              <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="flex items-center gap-3">
                <span className="w-4 text-[12.5px] font-semibold text-ink-400">{i + 1}</span>
                <Avatar name={vendor.storeName} color={vendor.avatarColor} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink-800">{vendor.storeName}</p>
                  <p className="text-[12px] text-ink-500">{vendor.totalOrders} orders</p>
                </div>
                <p className="text-[13px] font-bold text-ink-900">{formatCurrency(vendor.revenue)}</p>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader
          title="Recent orders"
          action={
            <Link to="/orders" className="flex items-center gap-1 text-[12.5px] font-semibold text-brand-700 hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          }
        />
        <Table>
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Vendor</Th>
              <Th>Status</Th>
              <Th>Placed</Th>
              <Th className="text-right">Total</Th>
            </Tr>
          </Thead>
          <tbody>
            {recentOrders.map((order) => (
              <Tr key={order.id}>
                <Td>
                  <Link to={`/orders/${order.id}`} className="font-semibold text-ink-800 hover:text-brand-700">
                    {order.id}
                  </Link>
                </Td>
                <Td>{order.customerName}</Td>
                <Td>{order.vendorName}</Td>
                <Td>
                  <StatusBadge status={order.status} label={ORDER_STATUS_META[order.status].label} />
                </Td>
                <Td className="text-ink-500">{timeAgo(order.placedAt)}</Td>
                <Td className="text-right font-semibold text-ink-800">{formatCurrency(order.total)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
