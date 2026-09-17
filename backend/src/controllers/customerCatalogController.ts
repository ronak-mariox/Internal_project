import type { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { toSafeJson } from '../lib/sanitize';
import { HttpError } from '../lib/httpError';

export async function getCategories(_req: Request, res: Response) {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json(categories.map((c) => toSafeJson(c)));
}

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export async function listProducts(req: Request, res: Response) {
  const { categoryId, subcategoryId, tag, search, sort } = req.query as Record<string, string | undefined>;
  const { page, limit, skip } = parsePagination(req);

  const filter: Record<string, unknown> = { status: 'active', isAvailable: true };
  if (categoryId) filter.categoryId = categoryId;
  if (subcategoryId) filter.subcategoryId = subcategoryId;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { 'variants.0.price': 1 },
    price_desc: { 'variants.0.price': -1 },
    newest: { createdAt: -1 },
  };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort ?? ''] ?? { createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    items: items.map((p) => toSafeJson(p)),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getProduct(req: Request, res: Response) {
  const product = await Product.findOne({ _id: req.params.id, status: 'active' });
  if (!product) throw new HttpError(404, 'Product not found');

  const similar = await Product.find({
    _id: { $ne: product._id },
    categoryId: product.categoryId,
    status: 'active',
    isAvailable: true,
  }).limit(10);

  res.json({ product: toSafeJson(product), similar: similar.map((p) => toSafeJson(p)) });
}

/**
 * Curated home-feed sections, driven by product `tags` (e.g. "deal", "saver",
 * "essential") rather than a hardcoded screen-specific model — keeps Verdant's
 * HomeScreen sections real without needing a bespoke banner-per-section schema.
 */
export async function getHome(_req: Request, res: Response) {
  const [categories, deals, saver, essentials, banners] = await Promise.all([
    Category.find({ isActive: true, showOnHome: true }).sort({ sortOrder: 1 }),
    Product.find({ status: 'active', isAvailable: true, tags: 'deal' }).limit(12),
    Product.find({ status: 'active', isAvailable: true, tags: 'saver' }).limit(10),
    Product.find({ status: 'active', isAvailable: true, tags: 'essential' }).limit(12),
    Category.find({ isActive: true, showOnHome: true }).sort({ sortOrder: 1 }).limit(6),
  ]);

  res.json({
    categories: categories.map((c) => toSafeJson(c)),
    topDeals: deals.map((p) => toSafeJson(p)),
    saverItems: saver.map((p) => toSafeJson(p)),
    essentialItems: essentials.map((p) => toSafeJson(p)),
    banners: banners.map((c) => ({ id: String(c._id), title: c.name, imageUrl: c.imageUrl })),
  });
}

export async function search(req: Request, res: Response) {
  const q = String(req.query.q ?? '').trim();
  if (!q) {
    res.json({ items: [] });
    return;
  }
  const items = await Product.find({ status: 'active', isAvailable: true, $text: { $search: q } }).limit(20);
  res.json({ items: items.map((p) => toSafeJson(p)) });
}
