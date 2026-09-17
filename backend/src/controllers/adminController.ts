import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { Vendor } from '../models/Vendor';
import { Driver } from '../models/Driver';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { issueTokenPair } from '../lib/tokens';
import { toSafeJson } from '../lib/sanitize';
import { HttpError } from '../lib/httpError';

export async function login(req: Request, res: Response) {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin || !(await bcrypt.compare(req.body.password, admin.passwordHash))) {
    res.status(401).json({ error: 'Incorrect email or password' });
    return;
  }

  const tokens = await issueTokenPair(String(admin._id), 'admin');
  res.json({ ...tokens, admin: toSafeJson(admin, ['passwordHash']) });
}

export async function getMe(req: Request, res: Response) {
  const admin = await Admin.findById(req.user!.id);
  if (!admin) throw new HttpError(404, 'Admin not found');
  res.json(toSafeJson(admin, ['passwordHash']));
}

export async function getPendingVendors(_req: Request, res: Response) {
  const vendors = await Vendor.find({ status: 'pending', registrationStep: 'submitted' }).sort({ updatedAt: -1 });
  res.json(vendors.map((v) => toSafeJson(v, ['passwordHash'])));
}

export async function updateVendorStatus(req: Request, res: Response) {
  const vendor = await Vendor.findByIdAndUpdate(
    String(req.params.id),
    {
      $set: {
        status: req.body.status,
        kycStatus: req.body.kycStatus ?? (req.body.status === 'active' ? 'verified' : 'rejected'),
        rejectionReason: req.body.rejectionReason ?? null,
      },
    },
    { new: true },
  );
  if (!vendor) throw new HttpError(404, 'Vendor not found');
  res.json(toSafeJson(vendor, ['passwordHash']));
}

export async function getPendingDrivers(_req: Request, res: Response) {
  const drivers = await Driver.find({ status: 'pending', registrationStep: 'submitted' }).sort({ updatedAt: -1 });
  res.json(drivers);
}

export async function updateDriverStatus(req: Request, res: Response) {
  const driver = await Driver.findByIdAndUpdate(
    String(req.params.id),
    {
      $set: {
        status: req.body.status,
        kycStatus: req.body.kycStatus ?? (req.body.status === 'active' ? 'verified' : 'rejected'),
        rejectionReason: req.body.rejectionReason ?? null,
      },
    },
    { new: true },
  );
  if (!driver) throw new HttpError(404, 'Driver not found');
  res.json(driver);
}

// ---------------------------------------------------------------------------
// Directory listings — the full (not just pending) vendor/driver/customer
// rosters the admin panel's list/detail pages need.
// ---------------------------------------------------------------------------

export async function getAllVendors(req: Request, res: Response) {
  const { status, search } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { 'businessInfo.displayName': { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
  res.json(vendors.map((v) => toSafeJson(v, ['passwordHash'])));
}

export async function getVendorById(req: Request, res: Response) {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) throw new HttpError(404, 'Vendor not found');
  res.json(toSafeJson(vendor, ['passwordHash']));
}

export async function getAllDrivers(req: Request, res: Response) {
  const { status, search } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [{ fullName: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }];
  }
  const drivers = await Driver.find(filter).sort({ createdAt: -1 });
  res.json(drivers.map((d) => toSafeJson(d)));
}

export async function getDriverById(req: Request, res: Response) {
  const driver = await Driver.findById(req.params.id);
  if (!driver) throw new HttpError(404, 'Driver not found');
  res.json(toSafeJson(driver));
}

export async function getAllCustomers(req: Request, res: Response) {
  const { status, search } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const customers = await Customer.find(filter).sort({ createdAt: -1 });
  res.json(customers.map((c) => toSafeJson(c)));
}

export async function getCustomerById(req: Request, res: Response) {
  const customer = await Customer.findById(req.params.id);
  if (!customer) throw new HttpError(404, 'Customer not found');
  res.json(toSafeJson(customer));
}

export async function updateCustomerStatus(req: Request, res: Response) {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status } },
    { new: true },
  );
  if (!customer) throw new HttpError(404, 'Customer not found');
  res.json(toSafeJson(customer));
}

// ---------------------------------------------------------------------------
// Dashboard — real aggregates over Order/Product/Vendor/Customer instead of
// the admin panel's previous client-side seeded-random numbers.
// ---------------------------------------------------------------------------

export async function getDashboard(_req: Request, res: Response) {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalOrders,
    ordersByStatusRaw,
    revenueAgg,
    pendingVendors,
    pendingProducts,
    totalCustomers,
    totalVendors,
    recentOrders,
    revenueByCategoryRaw,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: since30d } } },
      { $group: { _id: null, revenue: { $sum: '$pricing.grandTotal' }, orders: { $sum: 1 } } },
    ]),
    Vendor.countDocuments({ status: 'pending', registrationStep: 'submitted' }),
    Product.countDocuments({ status: 'pending' }),
    Customer.countDocuments(),
    Vendor.countDocuments({ status: 'active' }),
    Order.find().sort({ createdAt: -1 }).limit(10),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $lookup: { from: 'categories', localField: 'product.categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $group: { _id: '$category.name', revenue: { $sum: '$items.subtotal' } } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const ordersByStatus = Object.fromEntries(ordersByStatusRaw.map((r) => [r._id, r.count]));

  res.json({
    totalOrders,
    ordersByStatus,
    last30Days: { revenue: revenueAgg[0]?.revenue ?? 0, orders: revenueAgg[0]?.orders ?? 0 },
    pendingVendorApprovals: pendingVendors,
    pendingProductApprovals: pendingProducts,
    totalCustomers,
    totalActiveVendors: totalVendors,
    recentOrders: recentOrders.map((o) => toSafeJson(o)),
    revenueByCategory: revenueByCategoryRaw.map((r) => ({ category: r._id, revenue: r.revenue })),
  });
}
