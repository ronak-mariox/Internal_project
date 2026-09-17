import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, PackageSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { SearchInput } from '@/components/ui/Input';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Drawer';
import { customers } from '@/data/customers';
import type { Customer, CustomerStatus } from '@/types';
import { formatCurrency, formatDate, timeAgo } from '@/lib/format';

const STATUS_TABS: { value: CustomerStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
];

const PAGE_SIZE = 15;

export function Customers() {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<CustomerStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, CustomerStatus>>({});
  const [blockTarget, setBlockTarget] = useState<Customer | null>(null);

  const effectiveStatus = (c: Customer) => statusOverrides[c.id] ?? c.status;

  const totalCustomers = customers.length;
  const activeCount = customers.filter((c) => effectiveStatus(c) === 'active').length;
  const blockedCount = customers.filter((c) => effectiveStatus(c) === 'blocked').length;

  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q),
    );
  }, [search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searchFiltered.length };
    (['active', 'blocked'] as CustomerStatus[]).forEach((s) => {
      counts[s] = searchFiltered.filter((c) => effectiveStatus(c) === s).length;
    });
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFiltered, statusOverrides]);

  const filtered = useMemo(() => {
    if (statusTab === 'all') return searchFiltered;
    return searchFiltered.filter((c) => effectiveStatus(c) === statusTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFiltered, statusTab, statusOverrides]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabItems: TabItem[] = STATUS_TABS.map((t) => ({
    value: t.value,
    label: t.label,
    count: statusCounts[t.value] ?? 0,
  }));

  const unblock = (id: string) => setStatusOverrides((prev) => ({ ...prev, [id]: 'active' }));
  const confirmBlock = () => {
    if (!blockTarget) return;
    setStatusOverrides((prev) => ({ ...prev, [blockTarget.id]: 'blocked' }));
    setBlockTarget(null);
  };

  return (
    <div>
      <PageHeader title="Customers" subtitle="View and manage the Verdant customer base" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total customers"
          value={totalCustomers}
          icon={<Users size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={<UserCheck size={18} />}
          iconColor="#3B82F6"
          iconSurface="var(--color-info-surface)"
        />
        <StatCard
          label="Blocked"
          value={blockedCount}
          icon={<UserX size={18} />}
          iconColor="#DC2626"
          iconSurface="var(--color-danger-surface)"
        />
      </div>

      <div className="mt-5">
        <Tabs
          items={tabItems}
          value={statusTab}
          onChange={(v) => {
            setStatusTab(v as CustomerStatus | 'all');
            setPage(1);
          }}
        />
      </div>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-4">
          <SearchInput
            placeholder="Search by name, email, phone or city…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-xs"
          />
        </div>

        {paged.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={24} />}
            title="No customers found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th>Phone</Th>
                <Th>City</Th>
                <Th>Orders</Th>
                <Th>Total spent</Th>
                <Th>Last order</Th>
                <Th>Joined</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </Tr>
            </Thead>
            <tbody>
              {paged.map((c) => {
                const status = effectiveStatus(c);
                return (
                  <Tr key={c.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} color={c.avatarColor} size={38} />
                        <div className="min-w-0">
                          <Link
                            to={`/customers/${c.id}`}
                            className="block truncate font-semibold text-ink-800 hover:text-brand-700"
                          >
                            {c.name}
                          </Link>
                          <p className="truncate text-[12.5px] text-ink-500">{c.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-ink-600">{c.phone}</Td>
                    <Td className="text-ink-600">{c.city}</Td>
                    <Td className="text-ink-700">{c.totalOrders}</Td>
                    <Td className="font-semibold text-ink-800">{formatCurrency(c.totalSpent)}</Td>
                    <Td className="text-ink-500">{timeAgo(c.lastOrderAt)}</Td>
                    <Td className="text-ink-500">{formatDate(c.joinedAt)}</Td>
                    <Td>
                      <StatusBadge status={status} />
                    </Td>
                    <Td className="text-right">
                      {status === 'blocked' ? (
                        <button
                          onClick={() => unblock(c.id)}
                          className="rounded-md bg-success-surface px-2.5 py-1 text-[11px] font-semibold text-success hover:bg-success/20"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => setBlockTarget(c)}
                          className="rounded-md bg-danger-surface px-2.5 py-1 text-[11px] font-semibold text-danger hover:bg-danger/20"
                        >
                          Block
                        </button>
                      )}
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

      <Modal
        open={blockTarget !== null}
        onClose={() => setBlockTarget(null)}
        title="Block this customer?"
        footer={
          <>
            <Button variant="outline" onClick={() => setBlockTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmBlock}>
              Block customer
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          {blockTarget?.name} will no longer be able to place orders on Verdant until unblocked.
        </p>
      </Modal>
    </div>
  );
}
