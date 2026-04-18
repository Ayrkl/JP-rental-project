import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Tipler ──────────────────────────────────────────────────────────────────

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'overdue';

export type PaymentItem = {
  id: string;
  propertyId: string;
  tenantName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  receiptUrl?: string;
  paidAt?: string;
};

export type UtilityReading = {
  id: string;
  propertyId: string;
  month: string; // YYYY-MM
  electricity: { prev: number; curr: number; unitPrice: number; fixed: number };
  water:       { prev: number; curr: number; unitPrice: number; fixed: number };
  gas:         { prev: number; curr: number; unitPrice: number; fixed: number };
};

export type InitialCost = {
  id: string;
  propertyId: string;
  tenantName: string;
  monthlyRent: number;
  reikinMonths: number;   // 礼金 — kaç aylık
  shikikinMonths: number; // 敷金 — kaç aylık
  agencyFeeMonths: number; // 仲介手数料
  insurance: number;
  createdAt: string;
};

// ── Hesaplama yardımcıları ──────────────────────────────────────────────────

export const calcUtilityBill = (r: UtilityReading) => {
  const elec = (r.electricity.curr - r.electricity.prev) * r.electricity.unitPrice + r.electricity.fixed;
  const water = (r.water.curr - r.water.prev) * r.water.unitPrice + r.water.fixed;
  const gas = (r.gas.curr - r.gas.prev) * r.gas.unitPrice + r.gas.fixed;
  return { elec: Math.max(0, elec), water: Math.max(0, water), gas: Math.max(0, gas), total: Math.max(0, elec + water + gas) };
};

export const calcInitialCost = (c: InitialCost) => {
  const reikin    = c.monthlyRent * c.reikinMonths;
  const shikikin  = c.monthlyRent * c.shikikinMonths;
  const agency    = c.monthlyRent * c.agencyFeeMonths;
  const total     = c.monthlyRent + reikin + shikikin + agency + c.insurance;
  return { reikin, shikikin, agency, total };
};

// ── Mock veri ──────────────────────────────────────────────────────────────

const MOCK_PAYMENTS: PaymentItem[] = [
  { id: 'p1', propertyId: '', tenantName: 'Hiroshi Tanaka',   description: 'Haziran 2025 Kira',     amount: 120000, dueDate: '2025-06-01', status: 'paid',    paidAt: '2025-06-01' },
  { id: 'p2', propertyId: '', tenantName: 'Yuki Nakamura',    description: 'Haziran 2025 Kira',     amount: 95000,  dueDate: '2025-06-01', status: 'pending' },
  { id: 'p3', propertyId: '', tenantName: 'Kenji Watanabe',   description: 'Haziran 2025 Kira',     amount: 110000, dueDate: '2025-06-01', status: 'unpaid' },
  { id: 'p4', propertyId: '', tenantName: 'Aiko Suzuki',      description: 'Mayıs 2025 Kira',       amount: 88000,  dueDate: '2025-05-01', status: 'overdue' },
  { id: 'p5', propertyId: '', tenantName: 'Takeshi Yamamoto', description: 'Haziran 2025 Elektrik', amount: 8200,   dueDate: '2025-06-15', status: 'unpaid' },
  { id: 'p6', propertyId: '', tenantName: 'Hiroshi Tanaka',   description: 'Haziran 2025 Su',       amount: 4100,   dueDate: '2025-06-15', status: 'paid',    paidAt: '2025-06-10' },
  { id: 'p7', propertyId: '', tenantName: 'Sakura Ito',       description: 'Haziran 2025 Gaz',      amount: 5000,   dueDate: '2025-06-15', status: 'pending' },
];

const MOCK_CHART = [
  { month: 'Oca', expected: 413000, actual: 413000 },
  { month: 'Şub', expected: 413000, actual: 390000 },
  { month: 'Mar', expected: 413000, actual: 413000 },
  { month: 'Nis', expected: 413000, actual: 401000 },
  { month: 'May', expected: 413000, actual: 325000 },
  { month: 'Haz', expected: 413000, actual: 212000 },
];

// ── Store ──────────────────────────────────────────────────────────────────

interface AccountingStore {
  payments: PaymentItem[];
  utilityReadings: UtilityReading[];
  initialCosts: InitialCost[];
  chartData: typeof MOCK_CHART;

  approvePayment: (id: string) => void;
  rejectPayment: (id: string) => void;
  addUtilityReading: (r: Omit<UtilityReading, 'id'>) => void;
  addInitialCost: (c: Omit<InitialCost, 'id' | 'createdAt'>) => void;
}

export const useAccountingStore = create<AccountingStore>()(
  persist(
    (set) => ({
      payments: MOCK_PAYMENTS,
      utilityReadings: [],
      initialCosts: [],
      chartData: MOCK_CHART,

      approvePayment: (id) =>
        set((state) => ({
          payments: state.payments.map(p =>
            p.id === id ? { ...p, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : p
          ),
        })),

      rejectPayment: (id) =>
        set((state) => ({
          payments: state.payments.map(p =>
            p.id === id ? { ...p, status: 'unpaid', receiptUrl: undefined } : p
          ),
        })),

      addUtilityReading: (r) =>
        set((state) => ({
          utilityReadings: [{ ...r, id: Math.random().toString(36).slice(2, 9) }, ...state.utilityReadings],
        })),

      addInitialCost: (c) =>
        set((state) => ({
          initialCosts: [{ ...c, id: Math.random().toString(36).slice(2, 9), createdAt: new Date().toISOString() }, ...state.initialCosts],
        })),
    }),
    { name: 'accounting-storage-v1' }
  )
);
