import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ProductStatus =
  | 'active'
  | 'low-stock'
  | 'out-of-stock'
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'inactive'
  | 'uploading'
  | 'error';

export type ProductVariantSummary = {
  id: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  maxStock: number;
  status: ProductStatus;
  sku: string;
  barcode?: string;
  hsnCode?: string;
  gstRate?: string;
  packSize?: string;
  countryOfOrigin?: string;
  description?: string;
  galleryCount?: number;
  variants?: ProductVariantSummary[];
  updatedAt?: number;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tata Salt (500g)',
    brand: 'Tata',
    categoryId: 'grocery-staples',
    categoryName: 'Grocery & Staples',
    subcategoryId: 'salt-sugar-jaggery',
    subcategoryName: 'Salt, Sugar & Jaggery',
    mrp: 22,
    sellingPrice: 20,
    stock: 284,
    reorderLevel: 20,
    maxStock: 500,
    status: 'active',
    sku: 'TATA-SALT-500G',
    barcode: '8901058000356',
    hsnCode: '2501',
    gstRate: '0',
    packSize: '500g',
    countryOfOrigin: 'India',
    description: 'Vacuum evaporated iodised salt for better health and taste. Free-flowing and pure.',
    galleryCount: 2,
    variants: [
      { id: 'v250g', size: '250g', mrp: 12, sellingPrice: 11, isPrimary: false },
      { id: 'v500g', size: '500g', mrp: 22, sellingPrice: 20, isPrimary: true },
      { id: 'v1kg', size: '1kg', mrp: 42, sellingPrice: 39, isPrimary: false },
    ],
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'p2',
    name: 'Amul Full Cream Milk',
    brand: 'Amul',
    categoryId: 'dairy-eggs',
    categoryName: 'Dairy & Eggs',
    subcategoryId: 'milk',
    subcategoryName: 'Milk',
    mrp: 60,
    sellingPrice: 58,
    stock: 8,
    reorderLevel: 15,
    maxStock: 200,
    status: 'low-stock',
    sku: 'AMUL-MILK-1L',
    packSize: '1L',
    hsnCode: '0401',
    gstRate: '5',
    updatedAt: Date.now() - 26 * 60 * 60 * 1000,
  },
  {
    id: 'p3',
    name: 'Fortune Sunflower Oil 1L',
    brand: 'Fortune',
    categoryId: 'grocery-staples',
    categoryName: 'Grocery & Staples',
    subcategoryId: 'edible-oils',
    subcategoryName: 'Edible Oils',
    mrp: 145,
    sellingPrice: 132,
    stock: 0,
    reorderLevel: 10,
    maxStock: 150,
    status: 'out-of-stock',
    sku: 'FORTUNE-OIL-1L',
    packSize: '1L',
  },
  {
    id: 'p4',
    name: 'Surf Excel Matic 1kg',
    brand: 'Surf Excel',
    categoryId: 'household-cleaning',
    categoryName: 'Household & Cleaning',
    subcategoryId: 'detergents',
    subcategoryName: 'Detergents',
    mrp: 195,
    sellingPrice: 175,
    stock: 42,
    reorderLevel: 15,
    maxStock: 120,
    status: 'active',
    sku: 'SURF-EXCEL-1KG',
    packSize: '1kg',
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'p5',
    name: 'Maggi Masala Noodles',
    brand: 'Nestlé',
    categoryId: 'snacks-beverages',
    categoryName: 'Snacks & Beverages',
    subcategoryId: 'ready-to-eat',
    subcategoryName: 'Ready to Eat',
    mrp: 14,
    sellingPrice: 13,
    stock: 0,
    reorderLevel: 20,
    maxStock: 300,
    status: 'draft',
    sku: 'MAGGI-MASALA-70G',
    packSize: '70g',
  },
  {
    id: 'p6',
    name: 'Dettol Hand Sanitizer',
    brand: 'Dettol',
    categoryId: 'personal-care',
    categoryName: 'Personal Care',
    subcategoryId: 'bath-body',
    subcategoryName: 'Bath & Body',
    mrp: 99,
    sellingPrice: 88,
    stock: 156,
    reorderLevel: 25,
    maxStock: 250,
    status: 'inactive',
    sku: 'DETTOL-SANITIZER-200ML',
    packSize: '200ml',
  },
  {
    id: 'p7',
    name: 'Colgate Strong Teeth',
    brand: 'Colgate',
    categoryId: 'personal-care',
    categoryName: 'Personal Care',
    subcategoryId: 'oral-care',
    subcategoryName: 'Oral Care',
    mrp: 72,
    sellingPrice: 65,
    stock: 78,
    reorderLevel: 20,
    maxStock: 200,
    status: 'pending',
    sku: 'COLGATE-STRONG-150G',
    packSize: '150g',
  },
  {
    id: 'p8',
    name: "Lay's Classic Salted",
    brand: "Lay's",
    categoryId: 'snacks-beverages',
    categoryName: 'Snacks & Beverages',
    subcategoryId: 'chips-namkeen',
    subcategoryName: 'Chips & Namkeen',
    mrp: 22,
    sellingPrice: 20,
    stock: 0,
    reorderLevel: 30,
    maxStock: 300,
    status: 'error',
    sku: 'LAYS-SALTED-52G',
    packSize: '52g',
  },
  {
    id: 'p9',
    name: 'Aashirvaad Atta 5kg',
    brand: 'ITC',
    categoryId: 'grocery-staples',
    categoryName: 'Grocery & Staples',
    subcategoryId: 'rice-wheat',
    subcategoryName: 'Rice & Wheat',
    mrp: 285,
    sellingPrice: 285,
    stock: 0,
    reorderLevel: 10,
    maxStock: 100,
    status: 'uploading',
    sku: 'AASHIRVAAD-ATTA-5KG',
    packSize: '5kg',
  },
];

type ProductCatalogContextValue = {
  products: Product[];
  addProduct: (product: Product) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(null);

export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
  }, []);

  const setProductStatus = useCallback((id: string, status: ProductStatus) => {
    setProducts(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts(prev => prev.map(item => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const value = useMemo(
    () => ({ products, addProduct, setProductStatus, removeProduct, updateProduct }),
    [products, addProduct, setProductStatus, removeProduct, updateProduct],
  );

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalogProvider');
  }
  return context;
}
