import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type SettlementStatus = 'paid' | 'processing' | 'pending' | 'failed';

export type WeeklyBreakdownRow = {
  label: string;
  sales: number;
  amount: number;
};

export type Settlement = {
  id: string;
  dateRangeLabel: string;
  status: SettlementStatus;
  grossSales: number;
  returns: number;
  netSales: number;
  commissionRate: number;
  commission: number;
  gstOnCommission: number;
  adjustments: number;
  netPayout: number;
  bankAccountLabel: string;
  transactionRef?: string;
  transactionDate?: string;
  dueDateLabel?: string;
  failureReason?: string;
};

const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'STL-2024-0089',
    dateRangeLabel: '1–7 Nov 2024',
    status: 'paid',
    grossSales: 42180,
    returns: 680,
    netSales: 41500,
    commissionRate: 8,
    commission: 3320,
    gstOnCommission: 598,
    adjustments: 0,
    netPayout: 37582,
    bankAccountLabel: 'HDFC Bank ****2847',
    transactionRef: 'TXN8847291',
    transactionDate: '8 Nov 2024, 2:34 PM',
  },
  {
    id: 'STL-2024-0088',
    dateRangeLabel: '25–31 Oct 2024',
    status: 'paid',
    grossSales: 38650,
    returns: 420,
    netSales: 38230,
    commissionRate: 8,
    commission: 3058,
    gstOnCommission: 550,
    adjustments: 412,
    netPayout: 34210,
    bankAccountLabel: 'HDFC Bank ****2847',
    transactionRef: 'TXN8801532',
    transactionDate: '1 Nov 2024, 11:02 AM',
  },
  {
    id: 'STL-2024-0090',
    dateRangeLabel: '8–14 Nov 2024',
    status: 'processing',
    grossSales: 25640,
    returns: 310,
    netSales: 25330,
    commissionRate: 8,
    commission: 2026,
    gstOnCommission: 365,
    adjustments: 189,
    netPayout: 22450,
    bankAccountLabel: 'HDFC Bank ****2847',
    dueDateLabel: 'Due 12 Nov',
    failureReason: 'Bank account verification failed',
  },
];

const WEEKLY_COMMISSION: WeeklyBreakdownRow[] = [
  { label: 'Week 1', sales: 10240, amount: 819 },
  { label: 'Week 2', sales: 52340, amount: 4187 },
  { label: 'Week 3', sales: 61820, amount: 4946 },
  { label: 'Week 4', sales: 59920, amount: 4794 },
];

const WEEKLY_TAXES: WeeklyBreakdownRow[] = [
  { label: 'Week 1', sales: 819, amount: 147 },
  { label: 'Week 2', sales: 4187, amount: 754 },
  { label: 'Week 3', sales: 4946, amount: 890 },
  { label: 'Week 4', sales: 4794, amount: 863 },
];

const WEEKLY_ADJUSTMENTS: WeeklyBreakdownRow[] = [
  { label: 'Week 1', sales: 10240, amount: 0 },
  { label: 'Week 2', sales: 52340, amount: 412 },
  { label: 'Week 3', sales: 61820, amount: 0 },
  { label: 'Week 4', sales: 59920, amount: 189 },
];

type PaymentsContextValue = {
  settlements: Settlement[];
  getSettlement: (settlementId: string) => Settlement | undefined;
  weeklyCommission: WeeklyBreakdownRow[];
  weeklyTaxes: WeeklyBreakdownRow[];
  weeklyAdjustments: WeeklyBreakdownRow[];
  retrySettlement: (settlementId: string) => void;
};

const PaymentsContext = createContext<PaymentsContextValue | null>(null);

export function PaymentsProvider({ children }: { children: React.ReactNode }) {
  const [settlements, setSettlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);

  const getSettlement = useCallback(
    (settlementId: string) => settlements.find(settlement => settlement.id === settlementId),
    [settlements],
  );

  const retrySettlement = useCallback((settlementId: string) => {
    setSettlements(prev =>
      prev.map(settlement =>
        settlement.id === settlementId ? { ...settlement, status: 'processing', failureReason: undefined } : settlement,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      settlements,
      getSettlement,
      weeklyCommission: WEEKLY_COMMISSION,
      weeklyTaxes: WEEKLY_TAXES,
      weeklyAdjustments: WEEKLY_ADJUSTMENTS,
      retrySettlement,
    }),
    [settlements, getSettlement, retrySettlement],
  );

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>;
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
}
