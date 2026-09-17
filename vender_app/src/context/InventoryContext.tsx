import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useProductCatalog } from './ProductCatalogContext';
import { api } from '../services/api';

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

// NOTE: there is no backend stock-ledger/audit-log model. This event list is an in-memory-only
// client-side log of stock changes made *during this app session* — it is not persisted, has no
// server equivalent, and resets on app restart. The stock numbers it describes are real (backed
// by `PATCH /vendor/products/:id/stock`); only this history trail is a client-side convenience.
function seedEvents(): StockEvent[] {
  return [];
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
  recordStockChange: (params: RecordStockChangeParams) => Promise<{ wentOutOfStock: boolean } | undefined>;
  eventsForProduct: (productId: string) => StockEvent[];
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { products, refreshProducts } = useProductCatalog();
  const [events, setEvents] = useState<StockEvent[]>(seedEvents);

  const recordStockChange = useCallback(
    async ({ productId, newStock, reason, type = 'adjustment', reference, actor = 'You' }: RecordStockChangeParams) => {
      const product = products.find(item => item.id === productId);
      if (!product) return undefined;

      const primaryVariantId = product.variants?.find(variant => variant.isPrimary)?.id ?? product.variants?.[0]?.id;
      if (!primaryVariantId) return undefined;

      const clampedStock = Math.max(0, newStock);
      const delta = clampedStock - product.stock;
      const wentOutOfStock = clampedStock === 0 && product.stock > 0;

      await api.patch(`/vendor/products/${productId}/stock`, {
        variantId: primaryVariantId,
        stock: clampedStock,
      });

      await refreshProducts();

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
    [products, refreshProducts],
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
