import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product, ProductStatus, useProductCatalog } from './ProductCatalogContext';

export type BasicInfoData = {
  name: string;
  brand: string;
  manufacturer: string;
  countryOfOrigin: string;
  shortDescription: string;
};

export type ImagesData = {
  mainImageAdded: boolean;
  additionalImageCount: number;
};

export type CategoryData = {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
};

export type DescriptionData = {
  fullDescription: string;
  keyFeatures: string[];
};

export type ProductVariant = {
  id: string;
  size: string;
  mrp: string;
  sellingPrice: string;
  stock: string;
  isPrimary: boolean;
};

export type PackSizeData = {
  netWeight: string;
  unit: string;
  packType: string;
  itemsPerPack: string;
  variantsEnabled: boolean;
  variants: ProductVariant[];
};

export type PricingData = {
  mrp: string;
  mrpGstInclusive: boolean;
  sellingPrice: string;
};

export type DiscountMode = 'percentage' | 'fixed';

export type DiscountData = {
  mode: DiscountMode;
  value: string;
  limitedTimeOffer: boolean;
};

export type TaxData = {
  gstRate: string;
  hsnCode: string;
};

export type IdentifiersData = {
  sku: string;
  barcode: string;
};

export type StockData = {
  opening: number;
  reorderLevel: string;
  maxStock: string;
  trackAutomatically: boolean;
  autoPause: boolean;
};

export type AvailabilityData = {
  onlineStore: boolean;
  inStorePos: boolean;
  bulkOrders: boolean;
  schedulePublish: boolean;
};

type ProductDraft = {
  basicInfo?: BasicInfoData;
  images: ImagesData;
  category?: CategoryData;
  description?: DescriptionData;
  packSize?: PackSizeData;
  pricing?: PricingData;
  discount: DiscountData;
  tax?: TaxData;
  identifiers?: IdentifiersData;
  stock?: StockData;
  availability: AvailabilityData;
};

const INITIAL_DRAFT: ProductDraft = {
  images: { mainImageAdded: false, additionalImageCount: 0 },
  discount: { mode: 'percentage', value: '', limitedTimeOffer: false },
  availability: {
    onlineStore: true,
    inStorePos: false,
    bulkOrders: false,
    schedulePublish: false,
  },
};

type ProductDraftContextValue = {
  draft: ProductDraft;
  updateBasicInfo: (value: BasicInfoData) => void;
  updateImages: (value: ImagesData) => void;
  updateCategory: (value: CategoryData) => void;
  updateDescription: (value: DescriptionData) => void;
  updatePackSize: (value: PackSizeData) => void;
  updatePricing: (value: PricingData) => void;
  updateDiscount: (value: DiscountData) => void;
  updateTax: (value: TaxData) => void;
  updateIdentifiers: (value: IdentifiersData) => void;
  updateStock: (value: StockData) => void;
  updateAvailability: (value: AvailabilityData) => void;
  resetDraft: () => void;
  computedDiscountPercent: () => number;
  publishDraft: (status: ProductStatus) => Product;
};

const ProductDraftContext = createContext<ProductDraftContextValue | null>(null);

export function ProductDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<ProductDraft>(INITIAL_DRAFT);
  const { addProduct } = useProductCatalog();

  const updateBasicInfo = useCallback((value: BasicInfoData) => {
    setDraft(prev => ({ ...prev, basicInfo: value }));
  }, []);
  const updateImages = useCallback((value: ImagesData) => {
    setDraft(prev => ({ ...prev, images: value }));
  }, []);
  const updateCategory = useCallback((value: CategoryData) => {
    setDraft(prev => ({ ...prev, category: value }));
  }, []);
  const updateDescription = useCallback((value: DescriptionData) => {
    setDraft(prev => ({ ...prev, description: value }));
  }, []);
  const updatePackSize = useCallback((value: PackSizeData) => {
    setDraft(prev => ({ ...prev, packSize: value }));
  }, []);
  const updatePricing = useCallback((value: PricingData) => {
    setDraft(prev => ({ ...prev, pricing: value }));
  }, []);
  const updateDiscount = useCallback((value: DiscountData) => {
    setDraft(prev => ({ ...prev, discount: value }));
  }, []);
  const updateTax = useCallback((value: TaxData) => {
    setDraft(prev => ({ ...prev, tax: value }));
  }, []);
  const updateIdentifiers = useCallback((value: IdentifiersData) => {
    setDraft(prev => ({ ...prev, identifiers: value }));
  }, []);
  const updateStock = useCallback((value: StockData) => {
    setDraft(prev => ({ ...prev, stock: value }));
  }, []);
  const updateAvailability = useCallback((value: AvailabilityData) => {
    setDraft(prev => ({ ...prev, availability: value }));
  }, []);
  const resetDraft = useCallback(() => {
    setDraft(INITIAL_DRAFT);
  }, []);

  const computedDiscountPercent = useCallback(() => {
    const mrp = parseFloat(draft.pricing?.mrp ?? '');
    const sp = parseFloat(draft.pricing?.sellingPrice ?? '');
    if (!mrp || !sp || mrp <= 0 || sp > mrp) return 0;
    return Math.round(((mrp - sp) / mrp) * 1000) / 10;
  }, [draft.pricing]);

  const publishDraft = useCallback(
    (status: ProductStatus) => {
      const mrp = parseFloat(draft.pricing?.mrp ?? '0') || 0;
      const sellingPrice = parseFloat(draft.pricing?.sellingPrice ?? '0') || mrp;
      const product: Product = {
        id: `p${Date.now()}`,
        name: draft.basicInfo?.name ?? 'Untitled Product',
        brand: draft.basicInfo?.brand ?? '',
        categoryId: draft.category?.categoryId ?? '',
        categoryName: draft.category?.categoryName ?? '',
        subcategoryId: draft.category?.subcategoryId ?? '',
        subcategoryName: draft.category?.subcategoryName ?? '',
        mrp,
        sellingPrice,
        stock: draft.stock?.opening ?? 0,
        reorderLevel: parseInt(draft.stock?.reorderLevel ?? '0', 10) || 0,
        maxStock: parseInt(draft.stock?.maxStock ?? '0', 10) || 0,
        status,
        sku: draft.identifiers?.sku ?? '',
        barcode: draft.identifiers?.barcode || undefined,
        hsnCode: draft.tax?.hsnCode || undefined,
        gstRate: draft.tax?.gstRate || undefined,
        packSize: draft.packSize ? `${draft.packSize.netWeight}${draft.packSize.unit.split(' ')[0]}` : undefined,
      };
      addProduct(product);
      return product;
    },
    [draft, addProduct],
  );

  const value = useMemo(
    () => ({
      draft,
      updateBasicInfo,
      updateImages,
      updateCategory,
      updateDescription,
      updatePackSize,
      updatePricing,
      updateDiscount,
      updateTax,
      updateIdentifiers,
      updateStock,
      updateAvailability,
      resetDraft,
      computedDiscountPercent,
      publishDraft,
    }),
    [
      draft,
      updateBasicInfo,
      updateImages,
      updateCategory,
      updateDescription,
      updatePackSize,
      updatePricing,
      updateDiscount,
      updateTax,
      updateIdentifiers,
      updateStock,
      updateAvailability,
      resetDraft,
      computedDiscountPercent,
      publishDraft,
    ],
  );

  return <ProductDraftContext.Provider value={value}>{children}</ProductDraftContext.Provider>;
}

export function useProductDraft() {
  const context = useContext(ProductDraftContext);
  if (!context) {
    throw new Error('useProductDraft must be used within a ProductDraftProvider');
  }
  return context;
}
