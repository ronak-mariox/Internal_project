import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidation } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as ctrl from '../controllers/adminCatalogController';

export const adminCatalogRouter = Router();
adminCatalogRouter.use(authenticate, authorize('admin'));

// Categories
adminCatalogRouter.get('/categories', asyncHandler(ctrl.listCategories));
adminCatalogRouter.post(
  '/categories',
  body('name').isString().trim().notEmpty().withMessage('Category name is required'),
  handleValidation,
  asyncHandler(ctrl.createCategory),
);
adminCatalogRouter.patch('/categories/:id', param('id').isString().notEmpty(), handleValidation, asyncHandler(ctrl.updateCategory));
adminCatalogRouter.delete('/categories/:id', param('id').isString().notEmpty(), handleValidation, asyncHandler(ctrl.deleteCategory));

adminCatalogRouter.post(
  '/categories/:id/subcategories',
  param('id').isString().notEmpty(),
  body('name').isString().trim().notEmpty().withMessage('Subcategory name is required'),
  handleValidation,
  asyncHandler(ctrl.addSubcategory),
);
adminCatalogRouter.patch(
  '/categories/:id/subcategories/:subId',
  param('id').isString().notEmpty(),
  param('subId').isString().notEmpty(),
  handleValidation,
  asyncHandler(ctrl.updateSubcategory),
);
adminCatalogRouter.delete(
  '/categories/:id/subcategories/:subId',
  param('id').isString().notEmpty(),
  param('subId').isString().notEmpty(),
  handleValidation,
  asyncHandler(ctrl.removeSubcategory),
);

// Product moderation
adminCatalogRouter.get('/products', asyncHandler(ctrl.listAllProducts));
adminCatalogRouter.get('/products/:id', param('id').isString().notEmpty(), handleValidation, asyncHandler(ctrl.getProductForAdmin));
adminCatalogRouter.patch(
  '/products/:id/status',
  param('id').isString().notEmpty(),
  body('status').isIn(['active', 'inactive', 'rejected']),
  body('rejectionReason').optional({ values: 'falsy' }).isString(),
  handleValidation,
  asyncHandler(ctrl.updateProductStatus),
);
adminCatalogRouter.patch('/products/:id', param('id').isString().notEmpty(), handleValidation, asyncHandler(ctrl.updateProductForAdmin));
