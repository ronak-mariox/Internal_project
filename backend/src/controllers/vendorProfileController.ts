import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Vendor, type RegistrationStepKey, type VendorAddressData } from '../models/Vendor';
import { Order } from '../models/Order';
import { toSafeJson } from '../lib/sanitize';
import { HttpError } from '../lib/httpError';

async function loadVendorOrThrow(vendorId: string) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new HttpError(404, 'Vendor not found');
  return vendor;
}

/**
 * Post-approval profile editing. Distinct from vendorRegistrationController's
 * saveXxx endpoints, which also advance `registrationStep` (onboarding
 * progress) — reusing those here would silently regress an already-active
 * vendor's registration state every time they edited a field later.
 */
export async function updateProfile(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const { businessInfo, ownerInfo, storeInfo, bankDetails, storeProfile } = req.body as {
    businessInfo?: Record<string, unknown>;
    ownerInfo?: Record<string, unknown>;
    storeInfo?: Record<string, unknown>;
    bankDetails?: Record<string, unknown>;
    storeProfile?: Record<string, unknown>;
  };

  if (businessInfo) vendor.set('businessInfo', { ...vendor.businessInfo, ...businessInfo });
  if (ownerInfo) vendor.set('ownerInfo', { ...vendor.ownerInfo, ...ownerInfo });
  if (storeInfo) vendor.set('storeInfo', { ...vendor.storeInfo, ...storeInfo });
  if (bankDetails) vendor.set('bankDetails', { ...vendor.bankDetails, ...bankDetails });
  // storeProfile (store display name/description) is the same field the
  // post-approval store-setup wizard writes — kept in sync so the name/
  // description customers see stays consistent with what's edited here.
  if (storeProfile) vendor.set('storeProfile', { ...vendor.storeProfile, ...storeProfile });

  await vendor.save();
  res.json(toSafeJson(vendor, ['passwordHash']));
}

/** Real order counts/revenue for the Profile tab's stat card — no rating system
 * exists yet, so `rating` is honestly null rather than a fabricated number. */
export async function getStats(req: Request, res: Response) {
  const vendorObjectId = new Types.ObjectId(req.user!.id);
  const [orders, revenueAgg] = await Promise.all([
    Order.countDocuments({ vendorId: vendorObjectId }),
    Order.aggregate([
      { $match: { vendorId: vendorObjectId, status: 'delivered' } },
      { $group: { _id: null, revenue: { $sum: '$pricing.grandTotal' } } },
    ]),
  ]);
  res.json({ orders, revenue: revenueAgg[0]?.revenue ?? 0, rating: null });
}

export async function listAddresses(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  res.json(vendor.addresses ?? []);
}

export async function addAddress(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const { label, line1, line2 } = req.body as { label: string; line1: string; line2?: string };
  const isFirst = (vendor.addresses ?? []).length === 0;
  const address: VendorAddressData = {
    id: new Types.ObjectId().toString(),
    label,
    line1,
    line2,
    isPrimary: isFirst,
  };
  vendor.addresses = [...(vendor.addresses ?? []), address];
  await vendor.save();
  res.status(201).json(vendor.addresses);
}

export async function updateAddress(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const { addressId } = req.params;
  const index = (vendor.addresses ?? []).findIndex((a) => a.id === addressId);
  if (index < 0) throw new HttpError(404, 'Address not found');

  const { label, line1, line2 } = req.body as { label?: string; line1?: string; line2?: string };
  const current = vendor.addresses[index];
  vendor.addresses[index] = {
    ...current,
    ...(label !== undefined && { label }),
    ...(line1 !== undefined && { line1 }),
    ...(line2 !== undefined && { line2 }),
  };
  vendor.markModified('addresses');
  await vendor.save();
  res.json(vendor.addresses);
}

export async function removeAddress(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const { addressId } = req.params;
  const remaining = (vendor.addresses ?? []).filter((a) => a.id !== addressId);
  if (remaining.length === vendor.addresses.length) throw new HttpError(404, 'Address not found');

  const removedWasPrimary = vendor.addresses.find((a) => a.id === addressId)?.isPrimary;
  if (removedWasPrimary && remaining.length > 0) remaining[0].isPrimary = true;

  vendor.addresses = remaining;
  await vendor.save();
  res.json(vendor.addresses);
}

export async function setPrimaryAddress(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const { addressId } = req.params;
  if (!(vendor.addresses ?? []).some((a) => a.id === addressId)) throw new HttpError(404, 'Address not found');

  vendor.addresses = vendor.addresses.map((a) => ({ ...a, isPrimary: a.id === addressId }));
  await vendor.save();
  res.json(vendor.addresses);
}

/** Swaps a KYC document's file and resets it to "pending" for re-review — the
 * only documents that are actual files (not just data fields) are PAN, GST
 * certificate, and the general business proof; bank details have no file to
 * replace. */
const REPLACEABLE_DOCUMENT_STEPS: RegistrationStepKey[] = ['panDetails', 'gstDetails', 'businessProof'];

export async function replaceDocument(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const stepKey = req.params.stepKey as RegistrationStepKey;
  if (!REPLACEABLE_DOCUMENT_STEPS.includes(stepKey)) {
    throw new HttpError(400, `"${req.params.stepKey}" is not a replaceable document`);
  }
  const { url } = req.body as { url: string };

  if (stepKey === 'panDetails') {
    if (!vendor.panDetails) throw new HttpError(404, 'No PAN details on file');
    vendor.set('panDetails', { ...vendor.panDetails, documentUrl: url });
  } else if (stepKey === 'gstDetails') {
    if (!vendor.gstDetails) throw new HttpError(404, 'No GST details on file');
    vendor.set('gstDetails', { ...vendor.gstDetails, certificateUrl: url });
  } else {
    if (!vendor.businessProof) throw new HttpError(404, 'No business proof on file');
    vendor.set('businessProof', { ...vendor.businessProof, frontUrl: url });
  }

  vendor.stepReviews = { ...(vendor.stepReviews ?? {}), [stepKey]: { status: 'pending' } };
  vendor.markModified('stepReviews');
  await vendor.save();
  res.json(toSafeJson(vendor, ['passwordHash']));
}

export async function getNotificationPrefs(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  res.json(vendor.notificationPrefs ?? {});
}

export async function updateNotificationPrefs(req: Request, res: Response) {
  const vendor = await loadVendorOrThrow(req.user!.id);
  const updates = req.body as Record<string, boolean>;
  vendor.notificationPrefs = { ...(vendor.notificationPrefs ?? {}), ...updates };
  vendor.markModified('notificationPrefs');
  await vendor.save();
  res.json(vendor.notificationPrefs);
}
