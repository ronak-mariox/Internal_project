import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, CheckCircle2, Clock, Ban, Star, Check, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { SearchInput, Select } from '@/components/ui/Input';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { vendors as seedVendors } from '@/data/vendors';
import type { Vendor, VendorStatus } from '@/types';
import { formatCurrency } from '@/lib/format';

const PAGE_SIZE = 15;

const STATUS_TABS: { value: VendorStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'rejected', label: 'Rejected' },
];

export function Vendors() {
  const [vendorList, setVendorList] = useState<Vendor[]>(seedVendors);
  const [statusTab, setStatusTab] = useState<VendorStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(seedVendors.map((v) => v.category))).sort(),
    [],
  );

  const tabItems: TabItem[] = STATUS_TABS.map((t) => ({
    value: t.value,
    label: t.label,
    count: t.value === 'all' ? vendorList.length : vendorList.filter((v) => v.status === t.value).length,
  }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendorList.filter((v) => {
      if (statusTab !== 'all' && v.status !== statusTab) return false;
      if (category !== 'all' && v.category !== category) return false;
      if (q && !`${v.storeName} ${v.ownerName} ${v.city}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [vendorList, statusTab, category, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalVendors = vendorList.length;
  const activeCount = vendorList.filter((v) => v.status === 'active').length;
  const pendingCount = vendorList.filter((v) => v.status === 'pending').length;
  const suspendedRejectedCount = vendorList.filter((v) => v.status === 'suspended' || v.status === 'rejected').length;

  function updateStatus(id: string, status: VendorStatus) {
    setVendorList((list) => list.map((v) => (v.id === id ? { ...v, status } : v)));
  }

  function handleTabChange(value: string) {
    setStatusTab(value as VendorStatus | 'all');
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Manage the vendor roster — review sign-ups, monitor stores, and handle suspensions"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total vendors"
          value={totalVendors}
          icon={<Store size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={<CheckCircle2 size={18} />}
          iconColor="#12866F"
          iconSurface="var(--color-success-surface)"
        />
        <StatCard
          label="Pending approval"
          value={pendingCount}
          icon={<Clock size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Suspended / rejected"
          value={suspendedRejectedCount}
          icon={<Ban size={18} />}
          iconColor="#DC2626"
          iconSurface="var(--color-danger-surface)"
        />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="All vendors"
          subtitle={`${filtered.length} vendor${filtered.length === 1 ? '' : 's'}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <Tabs items={tabItems} value={statusTab} onChange={handleTabChange} />
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              placeholder="Search store, owner, city…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-64"
            />
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <EmptyState
            icon={<Store size={24} />}
            title="No vendors found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Store</Th>
                <Th>Category</Th>
                <Th>City</Th>
                <Th>Rating</Th>
                <Th>Orders</Th>
                <Th>Revenue</Th>
                <Th>Commission</Th>
                <Th>KYC</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <tbody>
              {pageItems.map((vendor) => (
                <Tr key={vendor.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={vendor.storeName} color={vendor.avatarColor} size={40} />
                      <div className="min-w-0">
                        <Link
                          to={`/vendors/${vendor.id}`}
                          className="block truncate font-semibold text-ink-800 hover:text-brand-700"
                        >
                          {vendor.storeName}
                        </Link>
                        <p className="truncate text-[12.5px] text-ink-500">{vendor.ownerName}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap">{vendor.category}</Td>
                  <Td className="whitespace-nowrap">{vendor.city}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 font-medium text-ink-700">
                      <Star size={13} className="fill-warning text-warning" />
                      {vendor.rating.toFixed(1)}
                    </span>
                  </Td>
                  <Td>{vendor.totalOrders.toLocaleString('en-IN')}</Td>
                  <Td className="font-semibold text-ink-800">{formatCurrency(vendor.revenue)}</Td>
                  <Td>{vendor.commissionRate}%</Td>
                  <Td>
                    <StatusBadge status={vendor.kycStatus} />
                  </Td>
                  <Td>
                    <StatusBadge status={vendor.status} />
                  </Td>
                  <Td>
                    {vendor.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<Check size={14} />}
                          onClick={() => updateStatus(vendor.id, 'active')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<X size={14} />}
                          onClick={() => updateStatus(vendor.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-ink-300">—</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}

        {pageItems.length > 0 && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </Card>
    </div>
  );
}
