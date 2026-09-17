import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageSearch,
  Star,
  CheckCircle2,
  XCircle,
  Power,
  Boxes,
  Clock,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Table';
import { SearchInput, Select } from '@/components/ui/Input';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { products as seedProducts } from '@/data/products';
import { categories } from '@/data/categories';
import type { Product, ProductStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';

const PAGE_SIZE = 12;

const STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
  rejected: 'Rejected',
  draft: 'Draft',
};

const STATUS_ORDER: ProductStatus[] = ['active', 'pending', 'low-stock', 'out-of-stock', 'rejected', 'draft'];

export function Products() {
  const [productsState, setProductsState] = useState<Product[]>(seedProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const total = productsState.length;
    const pending = productsState.filter((p) => p.status === 'pending').length;
    const lowStock = productsState.filter((p) => p.status === 'low-stock').length;
    const outOfStock = productsState.filter((p) => p.status === 'out-of-stock').length;
    return { total, pending, lowStock, outOfStock };
  }, [productsState]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: productsState.length };
    for (const status of STATUS_ORDER) counts[status] = 0;
    for (const p of productsState) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return counts;
  }, [productsState]);

  const tabItems: TabItem[] = [
    { value: 'all', label: 'All', count: statusCounts.all },
    ...STATUS_ORDER.map((status) => ({ value: status, label: STATUS_LABELS[status], count: statusCounts[status] ?? 0 })),
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return productsState.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))) {
        return false;
      }
      return true;
    });
  }, [productsState, search, categoryFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const selectedProduct = productsState.find((p) => p.id === selectedId) ?? null;

  const setProductStatus = (id: string, status: ProductStatus) => {
    setProductsState((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Browse and moderate the vendor product catalog listed under each category."
        actions={
          <Button variant="outline" disabled>
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total products"
          value={summary.total}
          icon={<Boxes size={18} />}
          iconColor="#1CA672"
          iconSurface="var(--color-brand-50)"
        />
        <StatCard
          label="Pending approval"
          value={summary.pending}
          icon={<Clock size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Low stock"
          value={summary.lowStock}
          icon={<AlertTriangle size={18} />}
          iconColor="#F79009"
          iconSurface="var(--color-warning-surface)"
        />
        <StatCard
          label="Out of stock"
          value={summary.outOfStock}
          icon={<PackageX size={18} />}
          iconColor="#E11D48"
          iconSurface="var(--color-danger-surface)"
        />
      </div>

      <Card className="mt-5">
        <div className="flex flex-col gap-3 border-b border-ink-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <SearchInput
              placeholder="Search by name, brand or SKU..."
              value={search}
              onChange={(e) => updateFilter(() => setSearch(e.target.value))}
              className="sm:max-w-xs"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => updateFilter(() => setCategoryFilter(e.target.value))}
              className="sm:w-56"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="px-5 py-4">
          <Tabs
            items={tabItems}
            value={statusFilter}
            onChange={(v) => updateFilter(() => setStatusFilter(v as ProductStatus | 'all'))}
          />
        </div>

        {pageItems.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={22} />}
            title="No products match your filters"
            description="Try adjusting your search, category or status filters."
          />
        ) : (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Category / Subcategory</Th>
                  <Th>Vendor</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Action</Th>
                </Tr>
              </Thead>
              <tbody>
                {pageItems.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-800">{product.name}</p>
                          <p className="text-[12px] text-ink-500">{product.brand}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-ink-700">{product.categoryName}</p>
                      <p className="text-[12px] text-ink-500">{product.subcategoryName}</p>
                    </Td>
                    <Td>
                      <Link to={`/vendors/${product.vendorId}`} className="text-ink-700 hover:text-brand-700">
                        {product.vendorName}
                      </Link>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-ink-800">{formatCurrency(product.sellingPrice)}</span>
                        {product.mrp !== product.sellingPrice && (
                          <span className="text-[12px] text-ink-400 line-through">{formatCurrency(product.mrp)}</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          'font-medium',
                          product.status === 'out-of-stock'
                            ? 'text-danger'
                            : product.status === 'low-stock'
                              ? 'text-warning'
                              : 'text-ink-700',
                        )}
                      >
                        {product.stock}
                      </span>
                      <span className="ml-1 text-[12px] text-ink-400">{product.unit}</span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1 text-ink-700">
                        <Star size={13} className="fill-warning text-warning" />
                        {product.rating.toFixed(1)}
                        <span className="text-[12px] text-ink-400">({product.ratingCount})</span>
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge status={product.status} label={STATUS_LABELS[product.status]} />
                    </Td>
                    <Td className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedId(product.id)}>
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onChange={setPage}
              total={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </Card>

      <Drawer
        open={!!selectedProduct}
        onClose={() => setSelectedId(null)}
        title={selectedProduct?.name ?? ''}
        subtitle={selectedProduct ? `${selectedProduct.categoryName} · ${selectedProduct.subcategoryName}` : undefined}
        footer={
          selectedProduct && (
            <div className="flex justify-end gap-2">
              {selectedProduct.status === 'pending' ? (
                <>
                  <Button
                    variant="danger"
                    icon={<XCircle size={15} />}
                    onClick={() => setProductStatus(selectedProduct.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    icon={<CheckCircle2 size={15} />}
                    onClick={() => setProductStatus(selectedProduct.id, 'active')}
                  >
                    Approve
                  </Button>
                </>
              ) : selectedProduct.status === 'rejected' || selectedProduct.status === 'draft' ? (
                <Button icon={<Power size={15} />} onClick={() => setProductStatus(selectedProduct.id, 'active')}>
                  Activate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  icon={<Power size={15} />}
                  onClick={() => setProductStatus(selectedProduct.id, 'draft')}
                >
                  Deactivate
                </Button>
              )}
            </div>
          )
        }
      >
        {selectedProduct && (
          <div className="space-y-5">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-48 w-full rounded-xl object-cover"
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-ink-900">{selectedProduct.name}</p>
                <p className="text-[13px] text-ink-500">{selectedProduct.brand}</p>
              </div>
              <StatusBadge status={selectedProduct.status} label={STATUS_LABELS[selectedProduct.status]} />
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200 p-4 text-[13px]">
              <div>
                <p className="text-ink-400">Selling price</p>
                <p className="font-semibold text-ink-800">{formatCurrency(selectedProduct.sellingPrice)}</p>
              </div>
              <div>
                <p className="text-ink-400">MRP</p>
                <p className={cn('font-semibold', selectedProduct.mrp !== selectedProduct.sellingPrice ? 'text-ink-400 line-through' : 'text-ink-800')}>
                  {formatCurrency(selectedProduct.mrp)}
                </p>
              </div>
              <div>
                <p className="text-ink-400">Stock</p>
                <p className="font-semibold text-ink-800">
                  {selectedProduct.stock} {selectedProduct.unit}
                </p>
              </div>
              <div>
                <p className="text-ink-400">Reorder level</p>
                <p className="font-semibold text-ink-800">{selectedProduct.reorderLevel}</p>
              </div>
              <div>
                <p className="text-ink-400">SKU</p>
                <p className="font-semibold text-ink-800">{selectedProduct.sku}</p>
              </div>
              <div>
                <p className="text-ink-400">GST rate</p>
                <p className="font-semibold text-ink-800">{selectedProduct.gstRate}%</p>
              </div>
              <div>
                <p className="text-ink-400">Rating</p>
                <p className="flex items-center gap-1 font-semibold text-ink-800">
                  <Star size={13} className="fill-warning text-warning" />
                  {selectedProduct.rating.toFixed(1)} ({selectedProduct.ratingCount})
                </p>
              </div>
              <div>
                <p className="text-ink-400">Last updated</p>
                <p className="font-semibold text-ink-800">{formatDate(selectedProduct.updatedAt)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-ink-200 p-4 text-[13px]">
              <p className="text-ink-400">Vendor</p>
              <Link
                to={`/vendors/${selectedProduct.vendorId}`}
                className="font-semibold text-ink-800 hover:text-brand-700"
              >
                {selectedProduct.vendorName}
              </Link>
            </div>

            <div className="rounded-xl border border-ink-200 p-4 text-[13px]">
              <p className="text-ink-400">Category</p>
              <p className="font-semibold text-ink-800">
                {selectedProduct.categoryName} <span className="font-normal text-ink-400">/</span> {selectedProduct.subcategoryName}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
