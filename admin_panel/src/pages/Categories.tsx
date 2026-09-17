import { useMemo, useState } from 'react';
import {
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Home,
  Eye,
  EyeOff,
  Layers,
  Package,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { Field, Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { categories as seedCategories } from '@/data/categories';
import type { Category, CatalogStatus, Subcategory } from '@/types';
import { cn } from '@/lib/cn';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'item';

interface DraftSubcategory {
  id: string;
  isNew: boolean;
  name: string;
  productCount: number;
  status: CatalogStatus;
}

interface DraftCategory {
  id: string | null;
  name: string;
  image: string;
  colorFrom: string;
  colorTo: string;
  order: number;
  status: CatalogStatus;
  showOnHome: boolean;
  subcategories: DraftSubcategory[];
}

const emptyDraft = (nextOrder: number): DraftCategory => ({
  id: null,
  name: '',
  image: '',
  colorFrom: '#4ADE80',
  colorTo: '#16A34A',
  order: nextOrder,
  status: 'active',
  showOnHome: true,
  subcategories: [],
});

const toDraft = (category: Category): DraftCategory => ({
  id: category.id,
  name: category.name,
  image: category.image,
  colorFrom: category.colorFrom,
  colorTo: category.colorTo,
  order: category.order,
  status: category.status,
  showOnHome: category.showOnHome,
  subcategories: category.subcategories.map((s) => ({
    id: s.id,
    isNew: false,
    name: s.name,
    productCount: s.productCount,
    status: s.status,
  })),
});

export function Categories() {
  const [categoriesState, setCategoriesState] = useState<Category[]>(seedCategories);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<DraftCategory>(emptyDraft(1));
  const [newSubName, setNewSubName] = useState('');

  const sortedCategories = useMemo(
    () => [...categoriesState].sort((a, b) => a.order - b.order),
    [categoriesState],
  );

  const openAddDrawer = () => {
    const nextOrder = categoriesState.length
      ? Math.max(...categoriesState.map((c) => c.order)) + 1
      : 1;
    setDraft(emptyDraft(nextOrder));
    setNewSubName('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (category: Category) => {
    setDraft(toDraft(category));
    setNewSubName('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleCategoryStatus = (id: string) => {
    setCategoriesState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)),
    );
  };

  const toggleShowOnHome = (id: string) => {
    setCategoriesState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, showOnHome: !c.showOnHome } : c)),
    );
  };

  const toggleSubcategoryStatus = (categoryId: string, subId: string) => {
    setCategoriesState((prev) =>
      prev.map((c) =>
        c.id !== categoryId
          ? c
          : {
              ...c,
              subcategories: c.subcategories.map((s) =>
                s.id === subId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s,
              ),
            },
      ),
    );
  };

  const removeSubcategory = (categoryId: string, subId: string) => {
    setCategoriesState((prev) =>
      prev.map((c) =>
        c.id !== categoryId ? c : { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) },
      ),
    );
  };

  const addDraftSubcategory = () => {
    const name = newSubName.trim();
    if (!name) return;
    setDraft((prev) => ({
      ...prev,
      subcategories: [
        ...prev.subcategories,
        { id: `sub-${slugify(name)}-${Date.now()}`, isNew: true, name, productCount: 0, status: 'active' },
      ],
    }));
    setNewSubName('');
  };

  const removeDraftSubcategory = (id: string) => {
    setDraft((prev) => ({ ...prev, subcategories: prev.subcategories.filter((s) => s.id !== id) }));
  };

  const renameDraftSubcategory = (id: string, name: string) => {
    setDraft((prev) => ({
      ...prev,
      subcategories: prev.subcategories.map((s) => (s.id === id ? { ...s, name } : s)),
    }));
  };

  const toggleDraftSubcategoryStatus = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      subcategories: prev.subcategories.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s,
      ),
    }));
  };

  const saveDraft = () => {
    if (!draft.name.trim()) return;

    const subcategories: Subcategory[] = draft.subcategories.map((s) => ({
      id: s.id,
      categoryId: draft.id ?? '',
      name: s.name,
      image: `https://picsum.photos/seed/${slugify(s.name)}/200/200`,
      productCount: s.productCount,
      status: s.status,
    }));

    if (draft.id) {
      const categoryId = draft.id;
      setCategoriesState((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                name: draft.name.trim(),
                image: draft.image.trim() || c.image,
                colorFrom: draft.colorFrom,
                colorTo: draft.colorTo,
                order: draft.order,
                status: draft.status,
                showOnHome: draft.showOnHome,
                subcategories: subcategories.map((s) => ({ ...s, categoryId })),
              }
            : c,
        ),
      );
    } else {
      const id = `cat-${slugify(draft.name)}-${Date.now()}`;
      const newCategory: Category = {
        id,
        name: draft.name.trim(),
        image: draft.image.trim() || `https://picsum.photos/seed/${slugify(draft.name)}/200/200`,
        colorFrom: draft.colorFrom,
        colorTo: draft.colorTo,
        order: draft.order,
        status: draft.status,
        showOnHome: draft.showOnHome,
        subcategories: subcategories.map((s) => ({ ...s, categoryId: id })),
      };
      setCategoriesState((prev) => [newCategory, ...prev]);
    }

    setDrawerOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Manage the taxonomy shown on the Verdant app's home screen category shelf and product browse."
        actions={
          <Button icon={<Plus size={16} />} onClick={openAddDrawer}>
            Add Category
          </Button>
        }
      />

      {sortedCategories.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Layers size={22} />}
            title="No categories yet"
            description="Create your first category to start building the Verdant app's home screen shelf."
            action={
              <Button icon={<Plus size={16} />} onClick={openAddDrawer}>
                Add Category
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedCategories.map((category) => {
            const totalProducts = category.subcategories.reduce((sum, s) => sum + s.productCount, 0);
            const isExpanded = !!expanded[category.id];
            return (
              <Card key={category.id} className="flex flex-col overflow-hidden">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-32 w-full rounded-t-2xl object-cover"
                  />
                  <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[11px] font-bold text-ink-700 shadow">
                    {category.order}
                  </span>
                  <button
                    onClick={() => toggleShowOnHome(category.id)}
                    title={category.showOnHome ? 'Shown on home shelf' : 'Hidden from home shelf'}
                    className={cn(
                      'absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold shadow',
                      category.showOnHome ? 'bg-brand-600 text-white' : 'bg-white/90 text-ink-500',
                    )}
                  >
                    <Home size={12} />
                    {category.showOnHome ? 'On home' : 'Hidden'}
                  </button>
                </div>

                <CardBody className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[15px] font-semibold text-ink-900">{category.name}</h3>
                    <StatusBadge status={category.status} />
                  </div>

                  <div className="flex items-center gap-4 text-[12.5px] text-ink-500">
                    <span className="flex items-center gap-1">
                      <Layers size={13} /> {category.subcategories.length} subcategories
                    </span>
                    <span className="flex items-center gap-1">
                      <Package size={13} /> {totalProducts} products
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" variant="outline" icon={<Pencil size={13} />} onClick={() => openEditDrawer(category)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={category.status === 'active' ? <EyeOff size={13} /> : <Eye size={13} />}
                      onClick={() => toggleCategoryStatus(category.id)}
                    >
                      {category.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <button
                      onClick={() => toggleExpanded(category.id)}
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="-mx-1 mt-1 border-t border-ink-100 pt-3">
                      {category.subcategories.length === 0 ? (
                        <p className="px-1 text-[12.5px] text-ink-400">
                          No subcategories yet. Edit this category to add one.
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {category.subcategories.map((sub) => (
                            <li
                              key={sub.id}
                              className="flex items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-[12.5px] hover:bg-ink-50"
                            >
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span
                                  className={cn(
                                    'h-1.5 w-1.5 shrink-0 rounded-full',
                                    sub.status === 'active' ? 'bg-success' : 'bg-ink-300',
                                  )}
                                />
                                <span className="truncate font-medium text-ink-700">{sub.name}</span>
                                <span className="shrink-0 text-ink-400">· {sub.productCount}</span>
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  onClick={() => toggleSubcategoryStatus(category.id, sub.id)}
                                  className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                                  title="Toggle active"
                                >
                                  {sub.status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
                                </button>
                                <button
                                  onClick={() => removeSubcategory(category.id, sub.id)}
                                  className="rounded-md p-1 text-ink-400 hover:bg-danger-surface hover:text-danger"
                                  title="Remove subcategory"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={draft.id ? 'Edit Category' : 'Add Category'}
        subtitle={draft.id ? 'Update details shown on the Verdant app' : 'Create a new home screen category'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button onClick={saveDraft} disabled={!draft.name.trim()}>
              {draft.id ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <Input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Grocery & Staples"
            />
          </Field>

          <Field label="Image URL" hint="Shown as the category tile image in the app">
            <Input
              value={draft.image}
              onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select
                value={draft.status}
                onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as CatalogStatus }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                min={1}
                value={draft.order}
                onChange={(e) => setDraft((prev) => ({ ...prev, order: Number(e.target.value) || 1 }))}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink-200 px-3.5 py-2.5">
            <div>
              <p className="text-[13px] font-medium text-ink-800">Show on home shelf</p>
              <p className="text-[12px] text-ink-500">Feature this category on the Verdant app home screen</p>
            </div>
            <button
              onClick={() => setDraft((prev) => ({ ...prev, showOnHome: !prev.showOnHome }))}
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                draft.showOnHome ? 'bg-brand-600' : 'bg-ink-200',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  draft.showOnHome ? 'translate-x-5' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>

          <div>
            <Field label="Subcategories" hint="Add, rename or remove subcategories for this category">
              <div className="flex gap-2">
                <Input
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="New subcategory name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDraftSubcategory();
                    }
                  }}
                />
                <Button variant="outline" icon={<Plus size={14} />} onClick={addDraftSubcategory}>
                  Add
                </Button>
              </div>
            </Field>

            {draft.subcategories.length > 0 && (
              <ul className="mt-3 space-y-2">
                {draft.subcategories.map((sub) => (
                  <li key={sub.id} className="flex items-center gap-2 rounded-xl border border-ink-200 px-2.5 py-2">
                    <Input
                      value={sub.name}
                      onChange={(e) => renameDraftSubcategory(sub.id, e.target.value)}
                      className="h-8 text-[13px]"
                    />
                    <span className="shrink-0 text-[11px] text-ink-400">{sub.productCount} items</span>
                    <button
                      onClick={() => toggleDraftSubcategoryStatus(sub.id)}
                      className="shrink-0 rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      title="Toggle active"
                    >
                      {sub.status === 'active' ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button
                      onClick={() => removeDraftSubcategory(sub.id)}
                      className="shrink-0 rounded-md p-1.5 text-ink-400 hover:bg-danger-surface hover:text-danger"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
