import { useMemo, useState } from 'react';
import { Plus, Tag, Pause, Play, Pencil, Calendar, Percent, ShoppingBag } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Drawer } from '@/components/ui/Drawer';
import { Field, Input, Label } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { offers as seedOffers } from '@/data/offers';
import type { Offer, OfferStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';

const STATUS_TABS: { value: OfferStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'paused', label: 'Paused' },
  { value: 'expired', label: 'Expired' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  code: '',
  type: 'percentage' as Offer['type'],
  value: '',
  minOrderValue: '',
  appliesTo: '',
  startDate: '',
  endDate: '',
};

function valueLabel(offer: Offer) {
  if (offer.type === 'percentage') return `${offer.value}% OFF`;
  if (offer.type === 'flat') return `${formatCurrency(offer.value)} OFF`;
  return 'Free Delivery';
}

export function Offers() {
  const [offerList, setOfferList] = useState<Offer[]>(seedOffers);
  const [statusTab, setStatusTab] = useState<OfferStatus | 'all'>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const tabItems: TabItem[] = STATUS_TABS.map((t) => ({
    value: t.value,
    label: t.label,
    count: t.value === 'all' ? offerList.length : offerList.filter((o) => o.status === t.value).length,
  }));

  const filtered = useMemo(() => {
    if (statusTab === 'all') return offerList;
    return offerList.filter((o) => o.status === statusTab);
  }, [offerList, statusTab]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDrawerOpen(true);
  }

  function openEdit(offer: Offer) {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      type: offer.type,
      value: String(offer.value),
      minOrderValue: String(offer.minOrderValue),
      appliesTo: offer.appliesTo,
      startDate: offer.startDate.slice(0, 10),
      endDate: offer.endDate.slice(0, 10),
    });
    setDrawerOpen(true);
  }

  function toggleStatus(id: string) {
    setOfferList((list) =>
      list.map((o) => {
        if (o.id !== id) return o;
        if (o.status === 'active') return { ...o, status: 'paused' };
        if (o.status === 'paused') return { ...o, status: 'active' };
        return o;
      }),
    );
  }

  function handleSave() {
    if (!form.title.trim() || !form.code.trim()) return;
    const payload: Offer = {
      id: editingId ?? `off-${Date.now()}`,
      title: form.title,
      description: form.description,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrderValue: Number(form.minOrderValue) || 0,
      appliesTo: form.appliesTo || 'All categories',
      usageCount: editingId ? (offerList.find((o) => o.id === editingId)?.usageCount ?? 0) : 0,
      status: editingId ? (offerList.find((o) => o.id === editingId)?.status ?? 'scheduled') : 'scheduled',
      startDate: form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : new Date().toISOString(),
    };
    setOfferList((list) => (editingId ? list.map((o) => (o.id === editingId ? payload : o)) : [payload, ...list]));
    setDrawerOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Offers & Promotions"
        subtitle="Create and manage coupon codes and promotional campaigns"
        actions={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Create Offer
          </Button>
        }
      />

      <div className="mb-5">
        <Tabs
          items={tabItems}
          value={statusTab}
          onChange={(v) => setStatusTab(v as OfferStatus | 'all')}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Tag size={24} />}
            title="No offers found"
            description="Try a different filter, or create a new offer to get started."
            action={
              <Button icon={<Plus size={16} />} onClick={openCreate}>
                Create Offer
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((offer) => (
            <Card key={offer.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    {offer.type === 'percentage' ? <Percent size={18} /> : offer.type === 'flat' ? <Tag size={18} /> : <ShoppingBag size={18} />}
                  </div>
                  <StatusBadge status={offer.status} />
                </div>

                <div>
                  <h3 className="font-display text-[15px] font-semibold text-ink-900">{offer.title}</h3>
                  <p className="mt-0.5 text-[13px] text-ink-500">{offer.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-ink-100 px-2 py-1 font-mono text-xs font-semibold text-ink-700">
                    {offer.code}
                  </span>
                  <span className="text-sm font-bold text-brand-700">{valueLabel(offer)}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12.5px] text-ink-500">
                  <span>Min order</span>
                  <span className="text-right font-medium text-ink-700">{formatCurrency(offer.minOrderValue)}</span>
                  <span>Applies to</span>
                  <span className="truncate text-right font-medium text-ink-700">{offer.appliesTo}</span>
                  <span>Used</span>
                  <span className="text-right font-medium text-ink-700">{offer.usageCount.toLocaleString('en-IN')} times</span>
                </div>

                <div className="mt-auto flex items-center gap-1.5 border-t border-ink-100 pt-3 text-[12px] text-ink-500">
                  <Calendar size={13} />
                  {formatDate(offer.startDate)} – {formatDate(offer.endDate)}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {(offer.status === 'active' || offer.status === 'paused') && (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={offer.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      onClick={() => toggleStatus(offer.id)}
                      className="flex-1"
                    >
                      {offer.status === 'active' ? 'Pause' : 'Resume'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Pencil size={14} />}
                    onClick={() => openEdit(offer)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit Offer' : 'Create Offer'}
        subtitle={editingId ? 'Update the promotion details' : 'Set up a new coupon or promotional campaign'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Create offer'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Welcome Offer" />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Flat 25% off on your first order"
            />
          </Field>
          <Field label="Coupon code">
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="WELCOME25"
              className="font-mono uppercase"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Offer['type'] })}
                className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-700 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat amount</option>
                <option value="free-delivery">Free delivery</option>
              </select>
            </div>
            <Field label="Value" hint={form.type === 'free-delivery' ? 'Not applicable' : form.type === 'percentage' ? 'In %' : 'In ₹'}>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                disabled={form.type === 'free-delivery'}
                placeholder="25"
              />
            </Field>
          </div>
          <Field label="Minimum order value (₹)">
            <Input
              type="number"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
              placeholder="199"
            />
          </Field>
          <Field label="Applies to">
            <Input
              value={form.appliesTo}
              onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
              placeholder="All customers · all categories"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date">
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label="End date">
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </Field>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
