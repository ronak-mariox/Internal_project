import type { Request, Response } from 'express';
import { Driver } from '../models/Driver';
import { createOtp, verifyOtp as verifyOtpCode } from '../lib/otp';
import { issueTokenPair } from '../lib/tokens';
import { toSafeJson } from '../lib/sanitize';
import { publicUrlFor } from '../lib/upload';
import { HttpError } from '../lib/httpError';

export async function requestOtp(req: Request, res: Response) {
  const { devOtp } = await createOtp(req.body.phone, 'driver');
  res.json({ message: 'OTP sent', ...(devOtp && { devOtp }) });
}

export async function verifyOtp(req: Request, res: Response) {
  const phone = req.body.phone as string;
  const result = await verifyOtpCode(phone, 'driver', req.body.otp);
  if (!result.ok) {
    res.status(400).json({ error: 'Incorrect or expired OTP', reason: result.reason });
    return;
  }

  let driver = await Driver.findOne({ phone });
  const isNewDriver = !driver;
  driver ??= await Driver.create({ phone });

  if (driver.status === 'suspended') {
    res.status(403).json({ error: 'This account has been restricted. Contact support for help.' });
    return;
  }

  const tokens = await issueTokenPair(String(driver._id), 'driver');
  res.json({ ...tokens, isNewDriver, driver: toSafeJson(driver) });
}

export async function getMe(req: Request, res: Response) {
  const driver = await Driver.findById(req.user!.id);
  if (!driver) throw new HttpError(404, 'Driver not found');
  res.json(driver);
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'No file uploaded — field name must be "avatar"');
  const avatarUrl = publicUrlFor(req.file.filename);
  await Driver.findByIdAndUpdate(req.user!.id, { $set: { avatarUrl } });
  res.json({ avatarUrl });
}

async function loadDriverOrThrow(driverId: string) {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new HttpError(404, 'Driver not found');
  return driver;
}

export async function savePersonalInfo(req: Request, res: Response) {
  const dobDate = new Date(req.body.dob);
  const ageYears = (Date.now() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears < 18) {
    res.status(422).json({ error: 'Validation failed', details: [{ path: 'dob', msg: 'You must be at least 18 years old' }] });
    return;
  }
  const { fullName, email, dob, gender } = req.body;
  await Driver.findByIdAndUpdate(req.user!.id, {
    $set: { fullName, email, dob, gender, registrationStep: 'personal-info' },
  });
  res.json({ message: 'Saved' });
}

export async function saveAddress(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, { $set: { address: req.body, registrationStep: 'address' } });
  res.json({ message: 'Saved' });
}

export async function saveEmergencyContact(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, {
    $set: { emergencyContact: req.body, registrationStep: 'emergency-contact' },
  });
  res.json({ message: 'Saved' });
}

export async function saveVehicleType(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, {
    $set: { vehicleType: req.body.vehicleType, registrationStep: 'vehicle-type' },
  });
  res.json({ message: 'Saved' });
}

export async function saveVehicleDetails(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, {
    $set: { vehicleDetails: req.body, registrationStep: 'vehicle-details' },
  });
  res.json({ message: 'Saved' });
}

export async function uploadDocument(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'No file uploaded — field name must be "file"');
  const driver = await loadDriverOrThrow(req.user!.id);
  const documents = { ...(driver.documents ?? {}), [req.body.type]: publicUrlFor(req.file.filename) };
  driver.documents = documents;
  driver.registrationStep = 'documents';
  await driver.save();
  res.json({ type: req.body.type, url: documents[req.body.type as keyof typeof documents] });
}

export async function saveInsuranceDetails(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, {
    $set: { insuranceDetails: req.body, registrationStep: 'insurance-details' },
  });
  res.json({ message: 'Saved' });
}

export async function saveBankDetails(req: Request, res: Response) {
  await Driver.findByIdAndUpdate(req.user!.id, { $set: { bankDetails: req.body, registrationStep: 'bank-details' } });
  res.json({ message: 'Saved' });
}

export async function getRegistration(req: Request, res: Response) {
  const driver = await loadDriverOrThrow(req.user!.id);
  res.json({
    registrationStep: driver.registrationStep,
    personalInfo: { fullName: driver.fullName ?? null, email: driver.email ?? null, dob: driver.dob ?? null, gender: driver.gender ?? null },
    avatarUrl: driver.avatarUrl ?? null,
    address: driver.address ?? null,
    emergencyContact: driver.emergencyContact ?? null,
    vehicleType: driver.vehicleType ?? null,
    vehicleDetails: driver.vehicleDetails ?? null,
    documents: driver.documents ?? null,
    insuranceDetails: driver.insuranceDetails ?? null,
    bankDetails: driver.bankDetails ?? null,
    referenceId: driver.referenceId ?? null,
  });
}

export async function getStatus(req: Request, res: Response) {
  const driver = await loadDriverOrThrow(req.user!.id);
  res.json({
    status: driver.status,
    kycStatus: driver.kycStatus,
    referenceId: driver.referenceId ?? null,
    rejectionReason: driver.rejectionReason ?? null,
  });
}

export async function submit(req: Request, res: Response) {
  const driver = await loadDriverOrThrow(req.user!.id);

  const documents = driver.documents ?? {};
  const missing: string[] = [];
  if (!driver.fullName || !driver.dob) missing.push('personalInfo');
  if (!driver.address) missing.push('address');
  if (!driver.emergencyContact) missing.push('emergencyContact');
  if (!driver.vehicleType || !driver.vehicleDetails) missing.push('vehicle');
  if (!documents.license_front) missing.push('drivingLicence');
  if (!driver.bankDetails) missing.push('bankDetails');

  if (missing.length > 0) {
    res.status(422).json({ error: 'Registration is incomplete', missingSteps: missing });
    return;
  }

  const referenceId = driver.referenceId ?? `VR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
  driver.referenceId = referenceId;
  driver.status = 'pending';
  driver.kycStatus = 'pending';
  driver.registrationStep = 'submitted';
  await driver.save();

  res.json({ referenceId: driver.referenceId, status: driver.status, kycStatus: driver.kycStatus });
}
