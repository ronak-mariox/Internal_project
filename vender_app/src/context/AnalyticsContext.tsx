import React, { createContext, useContext, useMemo } from 'react';

export type TrendDirection = 'up' | 'down' | 'flat';

export type KpiStat = {
  key: 'revenue' | 'orders' | 'avgOrder' | 'cancelled';
  label: string;
  value: string;
  changeLabel: string;
  direction: TrendDirection;
  sparkline: number[];
};

export type RankedProduct = {
  name: string;
  revenue: number;
  units: number;
  orders: number;
  trend: TrendDirection;
};

export type LowPerformingProduct = {
  name: string;
  unitsSold: number;
  revenue: number;
  daysSinceLastSale: number;
  stock: number;
  suggestion: string;
};

export type CancellationReason = {
  reason: string;
  count: number;
  percent: number;
};

export type InventoryPerformanceStat = {
  turnoverRate: number;
  avgDaysToSellOut: number;
  stockoutIncidents: number;
  deadStockValue: number;
  deadStockCount: number;
};

const REVENUE_TREND: number[] = [
  120, 128, 124, 134, 138, 132, 142, 148, 145, 152, 158, 150, 160, 165, 162, 168, 172, 170, 176,
  180, 178, 184, 188, 185, 190, 195, 192, 198, 202, 205,
];

const KPI_STATS: KpiStat[] = [
  {
    key: 'revenue',
    label: 'Revenue',
    value: '₹1,84,320',
    changeLabel: '↑ 12% vs last week',
    direction: 'up',
    sparkline: [40, 44, 42, 48, 52, 50, 58],
  },
  {
    key: 'orders',
    label: 'Orders',
    value: '847',
    changeLabel: '↑ 8% vs last week',
    direction: 'up',
    sparkline: [30, 32, 31, 35, 34, 38, 40],
  },
  {
    key: 'avgOrder',
    label: 'Avg Order',
    value: '₹218',
    changeLabel: '↑ 3% vs last week',
    direction: 'up',
    sparkline: [22, 23, 22, 24, 23, 25, 24],
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    value: '42',
    changeLabel: '↓ 5% vs last week',
    direction: 'down',
    sparkline: [10, 9, 11, 8, 9, 7, 8],
  },
];

const BEST_SELLING_PRODUCTS: RankedProduct[] = [
  { name: 'Amul Gold Milk 1L', revenue: 77314, units: 1247, orders: 612, trend: 'up' },
  { name: 'Fortune Sunflower Oil 1L', revenue: 71360, units: 892, orders: 540, trend: 'up' },
  { name: 'Maggi Noodles 70g', revenue: 34144, units: 2134, orders: 780, trend: 'up' },
  { name: 'Tata Salt 1kg', revenue: 31200, units: 1560, orders: 690, trend: 'up' },
  { name: 'Parle-G Biscuits 800g', revenue: 28350, units: 1890, orders: 705, trend: 'flat' },
  { name: 'Aashirvaad Atta 5kg', revenue: 25840, units: 340, orders: 310, trend: 'up' },
  { name: 'Red Label Tea 500g', revenue: 21000, units: 420, orders: 390, trend: 'down' },
  { name: 'Surf Excel 1kg', revenue: 18600, units: 310, orders: 288, trend: 'flat' },
  { name: 'Colgate 200g', revenue: 14400, units: 480, orders: 452, trend: 'up' },
  { name: 'Lays Masala 90g', revenue: 11400, units: 760, orders: 610, trend: 'down' },
];

const LOW_PERFORMING_PRODUCTS: LowPerformingProduct[] = [
  {
    name: 'Health Drink Mix 200g',
    unitsSold: 3,
    revenue: 540,
    daysSinceLastSale: 12,
    stock: 24,
    suggestion: 'Consider a promotional discount',
  },
  {
    name: 'Organic Quinoa 500g',
    unitsSold: 5,
    revenue: 975,
    daysSinceLastSale: 9,
    stock: 18,
    suggestion: 'Low visibility — feature in search results',
  },
  {
    name: 'Herbal Face Wash 100ml',
    unitsSold: 2,
    revenue: 398,
    daysSinceLastSale: 15,
    stock: 30,
    suggestion: 'Bundle with a bestseller',
  },
  {
    name: 'Gluten-Free Pasta 400g',
    unitsSold: 4,
    revenue: 620,
    daysSinceLastSale: 11,
    stock: 22,
    suggestion: 'Consider a promotional discount',
  },
  {
    name: 'Imported Olive Oil 250ml',
    unitsSold: 1,
    revenue: 449,
    daysSinceLastSale: 20,
    stock: 12,
    suggestion: 'Reprice — currently above market rate',
  },
];

const CANCELLATION_REASONS: CancellationReason[] = [
  { reason: 'Item out of stock', count: 16, percent: 38 },
  { reason: 'Customer changed mind', count: 11, percent: 26 },
  { reason: 'Delivery delay', count: 8, percent: 19 },
  { reason: 'Wrong item ordered', count: 4, percent: 10 },
  { reason: 'Other', count: 3, percent: 7 },
];

const INVENTORY_PERFORMANCE: InventoryPerformanceStat = {
  turnoverRate: 4.2,
  avgDaysToSellOut: 8,
  stockoutIncidents: 6,
  deadStockValue: 12480,
  deadStockCount: 14,
};

type AnalyticsContextValue = {
  revenueTrend: number[];
  kpiStats: KpiStat[];
  bestSellingProducts: RankedProduct[];
  lowPerformingProducts: LowPerformingProduct[];
  cancellationReasons: CancellationReason[];
  inventoryPerformance: InventoryPerformanceStat;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      revenueTrend: REVENUE_TREND,
      kpiStats: KPI_STATS,
      bestSellingProducts: BEST_SELLING_PRODUCTS,
      lowPerformingProducts: LOW_PERFORMING_PRODUCTS,
      cancellationReasons: CANCELLATION_REASONS,
      inventoryPerformance: INVENTORY_PERFORMANCE,
    }),
    [],
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
