import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Radio, Star, ShieldAlert, Bike, PackageSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { SearchInput, Select } from '@/components/ui/Input';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { drivers } from '@/data/drivers';
import type { DriverStatus, KycStatus } from '@/types';
import { formatCurrency } from '@/lib/format';

const STATUS_TABS: { value: DriverStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'online', label: 'Online' },
  { value: 'on-delivery', label: 'On delivery' },
  { value: 'offline', label: 'Offline' },
  { value: 'suspended', label: 'Suspended' },
];

const VEHICLE_TYPES: { value: string; label: string }[] = [
  { value: 'all', label: 'All vehicles' },
  { value: 'bicycle', label: 'Bicycle' },
  { value: 'motorbike', label: 'Motorbike' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'other', label: 'Other' },
];

const PAGE_SIZE = 15;

export function Drivers() {
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [statusTab, setStatusTab] = useState<DriverStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [kycOverrides, setKycOverrides] = useState<Record<string, KycStatus>>({});

  const effectiveKyc = (id: string, fallback: KycStatus) => kycOverrides[id] ?? fallback;

  const totalDrivers = drivers.length;
  const onlineNow = drivers.filter((d) => d.status === 'online' || d.status === 'on-delivery').length;
  const avgRating = totalDrivers ? (drivers.reduce((sum, d) => sum + d.rating, 0) / totalDrivers).toFixed(1) : '0.0';
  const pendingKyc = drivers.filter((d) => effectiveKyc(d.id, d.kycStatus) === 'pending').length;

  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.filter((d) => {
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.zone.toLowerCase().includes(q);
      const matchesVehicle = vehicleFilter === 'all' || d.vehicleType === vehicleFilter;
      return matchesSearch && matchesVehicle;
    });
  }, [search, vehicleFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searchFiltered.length };
    (['online', 'on-delivery', 'offline', 'suspended'] as DriverStatus[]).forEach((s) => {
      counts[s] = searchFiltered.filter((d) => d.status === s).length;
    });
    return counts;
  }, [searchFiltered]);

  const filtered = useMemo(() => {
    if (statusTab === 'all') return searchFiltered;
    return searchFiltered.filter((d) => d.status === statusTab);
  }, [searchFiltered, statusTab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabItems: TabItem[] = STATUS_TABS.map((t) => ({
    value: t.value,
    label: t.label,
    count: statusCounts[t.value] ?? 0,
  }));

  const approveKyc = (id: string) => setKycOverrides((prev) => ({ ...prev, [id]: 'verified' }));
  const rejectKyc = (id: string) => setKycOverrides((prev) => ({ ...prev, [id]: 'rejected' }));

  return (
    <div>
      <PageHeader
        title="Delivery Partners"
        subtitle="Monitor delivery partner availability, KYC status and performance"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total drivers"
          value={totalDrivers}
          icon={<Users size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Online now"
          value={onlineNow}
          icon={<Radio size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
        />
        <StatCard
          label="Avg rating"
          value={avgRating}
          icon={<Star size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Pending KYC"
          value={pendingKyc}
          icon={<ShieldAlert size={18} />}
          iconColor="#DC2626"
          iconSurface="var(--color-danger-surface)"
        />
      </div>

      <div className="mt-5">
        <Tabs
          items={tabItems}
          value={statusTab}
          onChange={(v) => {
            setStatusTab(v as DriverStatus | 'all');
            setPage(1);
          }}
        />
      </div>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-4">
          <SearchInput
            placeholder="Search by name, phone or zone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-xs"
          />
          <Select
            value={vehicleFilter}
            onChange={(e) => {
              setVehicleFilter(e.target.value);
              setPage(1);
            }}
          >
            {VEHICLE_TYPES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </Select>
        </div>

        {paged.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={24} />}
            title="No delivery partners found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Driver</Th>
                <Th>Zone</Th>
                <Th>Vehicle</Th>
                <Th>Status</Th>
                <Th>KYC</Th>
                <Th>Rating</Th>
                <Th>Deliveries</Th>
                <Th>Completion</Th>
                <Th className="text-right">Earnings (month)</Th>
              </Tr>
            </Thead>
            <tbody>
              {paged.map((d) => {
                const kyc = effectiveKyc(d.id, d.kycStatus);
                return (
                  <Tr key={d.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={d.name} color={d.avatarColor} size={38} />
                        <div className="min-w-0">
                          <Link
                            to={`/drivers/${d.id}`}
                            className="block truncate font-semibold text-ink-800 hover:text-brand-700"
                          >
                            {d.name}
                          </Link>
                          <p className="text-[12.5px] text-ink-500">{d.phone}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-ink-600">{d.zone}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5 text-ink-700">
                        <Bike size={14} className="text-ink-400" />
                        <span className="capitalize">{d.vehicleType}</span>
                      </div>
                      <p className="text-[12px] text-ink-500">{d.vehicleNumber}</p>
                    </Td>
                    <Td>
                      <StatusBadge status={d.status} />
                    </Td>
                    <Td>
                      <StatusBadge status={kyc} />
                      {kyc === 'pending' && (
                        <div className="mt-1.5 flex gap-1.5">
                          <button
                            onClick={() => approveKyc(d.id)}
                            className="rounded-md bg-success-surface px-2 py-0.5 text-[11px] font-semibold text-success hover:bg-success/20"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectKyc(d.id)}
                            className="rounded-md bg-danger-surface px-2 py-0.5 text-[11px] font-semibold text-danger hover:bg-danger/20"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-warning text-warning" />
                        <span className="font-medium text-ink-800">{d.rating}</span>
                      </div>
                    </Td>
                    <Td className="text-ink-700">{d.totalDeliveries}</Td>
                    <Td className="text-ink-700">{d.completionRate}%</Td>
                    <Td className="text-right font-semibold text-ink-800">
                      {formatCurrency(d.earningsThisMonth)}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={setPage}
          total={filtered.length}
          pageSize={PAGE_SIZE}
        />
      </Card>
    </div>
  );
}
