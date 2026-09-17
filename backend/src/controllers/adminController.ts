import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { Vendor } from '../models/Vendor';
import { Driver } from '../models/Driver';
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
