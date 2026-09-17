import type { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Vendor } from '../models/Vendor';
import { HttpError } from '../lib/httpError';
import { toSafeJson } from '../lib/sanitize';
import { publicUrlFor } from '../lib/upload';

async function assertApprovedVendor(vendorId: string) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new HttpError(404, 'Vendor not found');
  if (vendor.status !== 'active') {
    throw new HttpError(403, 'Your vendor account must be approved before you can manage products');
  }
}

export async function listMyProducts(req: Request, res: Response) {
  const { status, search } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = { vendorId: req.user!.id };
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products.map((p) => toSafeJson(p)));
}

export async function getMyProduct(req: Request, res: Response) {
  const product = await Product.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!product) throw new HttpError(404, 'Product not found');
  res.json(toSafeJson(product));
}

export async function createProduct(req: Request, res: Response) {
  await assertApprovedVendor(req.user!.id);
  const {
    categoryId,
    subcategoryId,
    name,
    description,
    brand,
    unit,
    images,
    variants,
    tags,
    taxRate,
    sku,
    barcode,
    hsnCode,
    countryOfOrigin,
    reorderLevel,
    maxStock,
  } = req.body;

  const product = await Product.create({
    vendorId: req.user!.id,
    categoryId,
    subcategoryId,
    name,
    description,
    brand,
    unit,
    images: images ?? [],
    variants,
    tags: tags ?? [],
    taxRate: taxRate ?? 0,
    status: 'pending',
    isAvailable: true,
    sku,
    barcode,
    hsnCode,
    countryOfOrigin,
    reorderLevel,
    maxStock,
  });
  res.status(201).json(toSafeJson(product));
}

export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!product) throw new HttpError(404, 'Product not found');

  const {
    categoryId,
    subcategoryId,
    name,
    description,
    brand,
    unit,
    images,
    variants,
    tags,
    taxRate,
    sku,
    barcode,
    hsnCode,
    countryOfOrigin,
    reorderLevel,
    maxStock,
  } = req.body;
  Object.assign(product, {
    ...(categoryId !== undefined && { categoryId }),
    ...(subcategoryId !== undefined && { subcategoryId }),
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(brand !== undefined && { brand }),
    ...(unit !== undefined && { unit }),
    ...(images !== undefined && { images }),
    ...(variants !== undefined && { variants }),
    ...(tags !== undefined && { tags }),
    ...(taxRate !== undefined && { taxRate }),
    ...(sku !== undefined && { sku }),
    ...(barcode !== undefined && { barcode }),
    ...(hsnCode !== undefined && { hsnCode }),
    ...(countryOfOrigin !== undefined && { countryOfOrigin }),
    ...(reorderLevel !== undefined && { reorderLevel }),
    ...(maxStock !== undefined && { maxStock }),
  });
  await product.save();
  res.json(toSafeJson(product));
}

export async function updateStock(req: Request, res: Response) {
  const product = await Product.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!product) throw new HttpError(404, 'Product not found');

  const { variantId, stock } = req.body as { variantId: string; stock: number };
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) throw new HttpError(404, 'Variant not found');

  variant.stock = stock;
  await product.save();
  res.json(toSafeJson(product));
}

export async function setAvailability(req: Request, res: Response) {
  const product = await Product.findOne({ _id: req.params.id, vendorId: req.user!.id });
  if (!product) throw new HttpError(404, 'Product not found');

  product.isAvailable = Boolean(req.body.isAvailable);
  await product.save();
  res.json(toSafeJson(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user!.id });
  if (!product) throw new HttpError(404, 'Product not found');
  res.status(204).end();
}

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'No file uploaded — field name must be "file"');
  res.status(201).json({ url: publicUrlFor(req.file.filename) });
}
