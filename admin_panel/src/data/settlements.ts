import type { VendorSettlement, DriverPayout } from '@/types';
import { vendors } from './vendors';
import { drivers } from './drivers';
import { createRng, pickWeighted, intBetween, daysAgo } from '@/lib/rng';

const rng = createRng(555);
const periods = ['1–7 Sep 2026', '8–14 Sep 2026', '15–21 Sep 2026'];

export const vendorSettlements: VendorSettlement[] = vendors.flatMap((vendor, vi) =>
  periods.map((periodLabel, pi) => {
    const grossSales = intBetween(rng, 8000, 180000);
    const commissionRate = vendor.commissionRate;
    const commission = Math.round((grossSales * commissionRate) / 100);
    const adjustments = pickWeighted(rng, [[0, 70], [-500, 15], [500, 15]] as const);
    const netPayout = grossSales - commission + adjustments;
    const status = pi === periods.length - 1
      ? pickWeighted(rng, [['processing', 50], ['pending', 50]] as const)
      : pickWeighted(rng, [['paid', 85], ['failed', 15]] as const);
    return {
      id: `stl-${vendor.id}-${pi}`,
      vendorId: vendor.id,
      vendorName: vendor.storeName,
      periodLabel,
      grossSales,
      commissionRate,
      commission,
      adjustments,
      netPayout,
      status,
      dueDate: daysAgo(-((pi + 1) * 7 - vi % 3)),
      transactionRef: status === 'paid' ? `TXN${intBetween(rng, 100000000, 999999999)}` : undefined,
    };
  })
);

export const driverPayouts: DriverPayout[] = drivers.map((driver, i) => {
  const deliveries = intBetween(rng, 20, 340);
  const baseEarnings = deliveries * intBetween(rng, 28, 45);
  const incentives = pickWeighted(rng, [[0, 40], [200, 30], [500, 20], [1000, 10]] as const);
  return {
    id: `pay-${driver.id}`,
    driverId: driver.id,
    driverName: driver.name,
    periodLabel: periods[periods.length - 1],
    deliveries,
    baseEarnings,
    incentives,
    totalPayout: baseEarnings + incentives,
    status: pickWeighted(rng, [['paid', 55], ['processing', 25], ['pending', 15], ['failed', 5]] as const),
    dueDate: daysAgo(-(3 + (i % 4))),
  };
});
