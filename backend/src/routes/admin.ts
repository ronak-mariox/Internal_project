import { Router } from 'express';
import { body, param } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { handleValidation } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as adminController from '../controllers/adminController';

export const adminRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts — please try again in a few minutes' },
});

adminRouter.post(
  '/auth/login',
  loginLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  handleValidation,
  asyncHandler(adminController.login),
);

adminRouter.get('/me', authenticate, authorize('admin'), asyncHandler(adminController.getMe));

// ---------------------------------------------------------------------------
// KYC approvals — makes vendor/driver "verification pending" screens reflect a
// real admin decision instead of a client-side random roll.
// ---------------------------------------------------------------------------

adminRouter.get(
  '/vendors/pending',
  authenticate,
  authorize('admin'),
  asyncHandler(adminController.getPendingVendors),
);

adminRouter.patch(
  '/vendors/:id/status',
  authenticate,
  authorize('admin'),
  param('id').isString().notEmpty(),
  body('status').isIn(['active', 'rejected', 'suspended']),
  body('kycStatus').optional().isIn(['verified', 'rejected', 'pending']),
  body('rejectionReason').optional({ values: 'falsy' }).isString(),
  handleValidation,
  asyncHandler(adminController.updateVendorStatus),
);

adminRouter.get(
  '/drivers/pending',
  authenticate,
  authorize('admin'),
  asyncHandler(adminController.getPendingDrivers),
);

adminRouter.patch(
  '/drivers/:id/status',
  authenticate,
  authorize('admin'),
  param('id').isString().notEmpty(),
  body('status').isIn(['active', 'rejected', 'suspended']),
  body('kycStatus').optional().isIn(['verified', 'rejected', 'pending']),
  body('rejectionReason').optional({ values: 'falsy' }).isString(),
  handleValidation,
  asyncHandler(adminController.updateDriverStatus),
);
