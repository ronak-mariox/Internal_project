import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product, useProductCatalog } from './ProductCatalogContext';

export type StockEventType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage' | 'bulk' | 'correction';

export type StockEvent = {
  id: string;
  productId: string;
  productName: string;
  type: StockEventType;
  delta: number;
  afterStock: number;
  reason: string;
  reference?: string;
  actor: 'You' | 'System';
  timestamp: number;
};

const HOUR = 60 * 60 * 1000;

function seedEvents(): StockEvent[] {
  const now = Date.now();
  return [
    {
      id: 'evt-amul-1',
      productId: 'p2',
      productName: 'Amul Full Cream Milk',
      type: 'sale',
      delta: -6,
      afterStock: 8,
      reason: 'Order #ORD-9142',
      reference: 'ORD-9142',
      actor: 'System',
      timestamp: now - 1 * HOUR,
    },
    {
      id: 'evt-tata-1',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'purchase',
      delta: 100,
      afterStock: 284,
      reason: 'New Stock Purchase',
      reference: 'INV-2026-0842',
      actor: 'You',
      timestamp: now - 3 * HOUR,
    },
    {
      id: 'evt-lays-1',
      productId: 'p8',
      productName: "Lay's Classic Salted",
      type: 'sale',
      delta: -20,
      afterStock: 0,
      reason: 'Order #ORD-9098',
      reference: 'ORD-9098',
      actor: 'System',
      timestamp: now - 5 * HOUR,
    },
    {
      id: 'evt-tata-2',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'sale',
      delta: -6,
      afterStock: 184,
      reason: 'Order #ORD-7821',
      reference: 'ORD-7821',
      actor: 'System',
      timestamp: now - 26 * HOUR,
    },
    {
      id: 'evt-tata-3',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'sale',
      delta: -12,
      afterStock: 190,
      reason: 'Order #ORD-7808',
      reference: 'ORD-7808',
      actor: 'System',
      timestamp: now - 30 * HOUR,
    },
    {
      id: 'evt-tata-4',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'damage',
      delta: -8,
      afterStock: 202,
      reason: 'Damage Write-off',
      reference: 'ADJ-0023',
      actor: 'You',
      timestamp: now - 50 * HOUR,
    },
    {
      id: 'evt-tata-5',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'return',
      delta: 2,
      afterStock: 210,
      reason: 'Return from Customer',
      reference: 'RET-0019',
      actor: 'System',
      timestamp: now - 74 * HOUR,
    },
    {
      id: 'evt-tata-6',
      productId: 'p1',
      productName: 'Tata Salt (500g)',
      type: 'sale',
      delta: -18,
      afterStock: 208,
      reason: 'Order #ORD-7782',
      reference: 'ORD-7782',
      actor: 'System',
      timestamp: now - 78 * HOUR,
    },
  ];
}

function nextStatusForStock(product: Product, newStock: number) {
  if (newStock <= 0) return 'out-of-stock' as const;
  const wasAvailable =
    product.status === 'active' || product.status === 'low-stock' || product.status === 'out-of-stock';
  if (!wasAvailable) return product.status;
  if (newStock <= product.reorderLevel) return 'low-stock' as const;
  return 'active' as const;
}

type RecordStockChangeParams = {
  productId: string;
  newStock: number;
  reason: string;
  type?: StockEventType;
  reference?: string;
  actor?: 'You' | 'System';
};

type InventoryContextValue = {
  events: StockEvent[];
  recordStockChange: (params: RecordStockChangeParams) => { wentOutOfStock: boolean } | undefined;
  eventsForProduct: (productId: string) => StockEvent[];
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { products, updateProduct } = useProductCatalog();
  const [events, setEvents] = useState<StockEvent[]>(seedEvents);

  const recordStockChange = useCallback(
    ({ productId, newStock, reason, type = 'adjustment', reference, actor = 'You' }: RecordStockChangeParams) => {
      const product = products.find(item => item.id === productId);
      if (!product) return undefined;

      const clampedStock = Math.max(0, newStock);
      const delta = clampedStock - product.stock;
      const wentOutOfStock = clampedStock === 0 && product.stock > 0;
      const status = nextStatusForStock(product, clampedStock);

      updateProduct(productId, { stock: clampedStock, status });

      setEvents(prev => [
        {
          id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          productId,
          productName: product.name,
          type,
          delta,
          afterStock: clampedStock,
          reason,
          reference,
          actor,
          timestamp: Date.now(),
        },
        ...prev,
      ]);

      return { wentOutOfStock };
    },
    [products, updateProduct],
  );

  const eventsForProduct = useCallback(
    (productId: string) => events.filter(event => event.productId === productId),
    [events],
  );

  const value = useMemo(
    () => ({ events, recordStockChange, eventsForProduct }),
    [events, recordStockChange, eventsForProduct],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
