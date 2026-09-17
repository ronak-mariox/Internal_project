import { useMemo, useState } from 'react';
import { Wallet, CircleCheck, Bike, Store } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Select } from '@/components/ui/Input';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { vendorSettlements, driverPayouts } from '@/data/settlements';
import type { SettlementStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';

const PAGE_SIZE = 14;

const SETTLEMENT_STATUSES: SettlementStatus[] = ['paid', 'processing', 'pending', 'failed'];

type Tab = 'vendors' | 'drivers';

export function Settlements() {
  const [tab, setTab] = useState<Tab>('vendors');
  const [vendorStatus, setVendorStatus] = useState<SettlementStatus | 'all'>('all');
  const [driverStatus, setDriverStatus] = useState<SettlementStatus | 'all'>('all');
  const [vendorPage, setVendorPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);

  const vendorPendingTotal = useMemo(
    () => vendorSettlements.filter((s) => s.status !== 'paid').reduce((sum, s) => sum + s.netPayout, 0),
    [],
  );
  const vendorPaidTotal = useMemo(
    () => vendorSettlements.filter((s) => s.status === 'paid').reduce((sum, s) => sum + s.netPayout, 0),
    [],
  );
  const driverPendingTotal = useMemo(
    () => driverPayouts.filter((p) => p.status !== 'paid').reduce((sum, p) => sum + p.totalPayout, 0),
    [],
  );
  const driverPaidTotal = useMemo(
    () => driverPayouts.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.totalPayout, 0),
    [],
  );

  const filteredVendors = useMemo(
    () => (vendorStatus === 'all' ? vendorSettlements : vendorSettlements.filter((s) => s.status === vendorStatus)),
    [vendorStatus],
  );
  const filteredDrivers = useMemo(
    () => (driverStatus === 'all' ? driverPayouts : driverPayouts.filter((p) => p.status === driverStatus)),
    [driverStatus],
  );

  const vendorPageCount = Math.max(1, Math.ceil(filteredVendors.length / PAGE_SIZE));
  const currentVendorPage = Math.min(vendorPage, vendorPageCount);
  const vendorPageItems = filteredVendors.slice((currentVendorPage - 1) * PAGE_SIZE, currentVendorPage * PAGE_SIZE);

  const driverPageCount = Math.max(1, Math.ceil(filteredDrivers.length / PAGE_SIZE));
  const currentDriverPage = Math.min(driverPage, driverPageCount);
  const driverPageItems = filteredDrivers.slice((currentDriverPage - 1) * PAGE_SIZE, currentDriverPage * PAGE_SIZE);

  const tabItems: TabItem[] = [
    { value: 'vendors', label: 'Vendor Settlements', count: vendorSettlements.length },
    { value: 'drivers', label: 'Driver Payouts', count: driverPayouts.length },
  ];

  return (
    <div>
      <PageHeader title="Settlements & Payouts" subtitle="Track vendor commissions and delivery partner earnings" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Vendor payouts pending"
          value={formatCurrency(vendorPendingTotal)}
          icon={<Wallet size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Vendor payouts paid"
          value={formatCurrency(vendorPaidTotal)}
          icon={<Store size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Driver payouts pending"
          value={formatCurrency(driverPendingTotal)}
          icon={<Bike size={18} />}
          iconColor="#4338CA"
          iconSurface="var(--color-indigo-surface)"
        />
        <StatCard
          label="Driver payouts paid"
          value={formatCurrency(driverPaidTotal)}
          icon={<CircleCheck size={18} />}
          iconColor="#12866F"
          iconSurface="var(--color-success-surface)"
        />
      </div>

      <Card className="mt-6">
        <CardHeader
          title={tab === 'vendors' ? 'Vendor settlements' : 'Driver payouts'}
          subtitle={tab === 'vendors' ? `${filteredVendors.length} settlements` : `${filteredDrivers.length} payouts`}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <Tabs items={tabItems} value={tab} onChange={(v) => setTab(v as Tab)} />
          {tab === 'vendors' ? (
            <Select
              value={vendorStatus}
              onChange={(e) => {
                setVendorStatus(e.target.value as SettlementStatus | 'all');
                setVendorPage(1);
              }}
            >
              <option value="all">All statuses</option>
              {SETTLEMENT_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </Select>
          ) : (
            <Select
              value={driverStatus}
              onChange={(e) => {
                setDriverStatus(e.target.value as SettlementStatus | 'all');
                setDriverPage(1);
              }}
            >
              <option value="all">All statuses</option>
              {SETTLEMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </div>

        {tab === 'vendors' ? (
          vendorPageItems.length === 0 ? (
            <EmptyState icon={<Store size={24} />} title="No settlements found" description="Try a different status filter." />
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Vendor</Th>
                    <Th>Period</Th>
                    <Th className="text-right">Gross sales</Th>
                    <Th className="text-right">Commission</Th>
                    <Th className="text-right">Adjustments</Th>
                    <Th className="text-right">Net payout</Th>
                    <Th>Status</Th>
                    <Th>Due date</Th>
                    <Th>Reference</Th>
                  </Tr>
                </Thead>
                <tbody>
                  {vendorPageItems.map((s) => (
                    <Tr key={s.id}>
                      <Td className="font-semibold text-ink-800">{s.vendorName}</Td>
                      <Td className="whitespace-nowrap text-ink-500">{s.periodLabel}</Td>
                      <Td className="text-right">{formatCurrency(s.grossSales)}</Td>
                      <Td className="text-right">
                        {s.commissionRate}% · {formatCurrency(s.commission)}
                      </Td>
                      <Td className={`text-right ${s.adjustments < 0 ? 'text-danger' : s.adjustments > 0 ? 'text-success' : 'text-ink-400'}`}>
                        {s.adjustments > 0 ? '+' : ''}
                        {formatCurrency(s.adjustments)}
                      </Td>
                      <Td className="text-right font-semibold text-ink-900">{formatCurrency(s.netPayout)}</Td>
                      <Td>
                        <StatusBadge status={s.status} />
                      </Td>
                      <Td className="whitespace-nowrap text-ink-500">{formatDate(s.dueDate)}</Td>
                      <Td className="whitespace-nowrap font-mono text-xs text-ink-500">{s.transactionRef ?? '—'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination
                page={currentVendorPage}
                pageCount={vendorPageCount}
                onChange={setVendorPage}
                total={filteredVendors.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )
        ) : driverPageItems.length === 0 ? (
          <EmptyState icon={<Bike size={24} />} title="No payouts found" description="Try a different status filter." />
        ) : (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th>Driver</Th>
                  <Th>Period</Th>
                  <Th className="text-right">Deliveries</Th>
                  <Th className="text-right">Base earnings</Th>
                  <Th className="text-right">Incentives</Th>
                  <Th className="text-right">Total payout</Th>
                  <Th>Status</Th>
                  <Th>Due date</Th>
                </Tr>
              </Thead>
              <tbody>
                {driverPageItems.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-semibold text-ink-800">{p.driverName}</Td>
                    <Td className="whitespace-nowrap text-ink-500">{p.periodLabel}</Td>
                    <Td className="text-right">{p.deliveries}</Td>
                    <Td className="text-right">{formatCurrency(p.baseEarnings)}</Td>
                    <Td className="text-right">{formatCurrency(p.incentives)}</Td>
                    <Td className="text-right font-semibold text-ink-900">{formatCurrency(p.totalPayout)}</Td>
                    <Td>
                      <StatusBadge status={p.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-ink-500">{formatDate(p.dueDate)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              page={currentDriverPage}
              pageCount={driverPageCount}
              onChange={setDriverPage}
              total={filteredDrivers.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </Card>
    </div>
  );
}
