import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MaintenanceType = 'periodic' | 'routine' | 'emergency';
export type MaintenanceStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type MaintenanceRecord = {
  id: string;
  propertyId: string;
  title: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  cost: number;
  provider: string;
  date: string;
  nextDate?: string;
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
};

const MOCK_RECORDS: MaintenanceRecord[] = [];

interface MaintenanceStore {
  records: MaintenanceRecord[];
  addRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
  getByPropertyId: (propertyId: string) => MaintenanceRecord[];
}

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  records: MOCK_RECORDS,

  addRecord: (record) =>
    set((state) => ({
      records: [
        { ...record, id: Math.random().toString(36).slice(2, 9) },
        ...state.records,
      ],
    })),

  updateRecord: (id, updates) =>
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),

  getByPropertyId: (propertyId) =>
    get().records.filter((r) => r.propertyId === propertyId),
}));
