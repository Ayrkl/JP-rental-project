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

const MOCK_RECORDS: MaintenanceRecord[] = [
  {
    id: 'm1', propertyId: '', title: 'Yıllık Kazan Bakımı', type: 'periodic', status: 'completed',
    cost: 4500, provider: 'Isıtma Teknik A.Ş.', date: '2025-01-15', nextDate: '2026-01-15',
    notes: 'Kazan temizlendi, filtreler değiştirildi.'
  },
  {
    id: 'm2', propertyId: '', title: 'Elektrik Pano Kontrolü', type: 'periodic', status: 'completed',
    cost: 2200, provider: 'Elektro Servis', date: '2025-02-10', nextDate: '2025-08-10',
    notes: 'Sigorta kutusu kontrol edildi, topraklama ölçüldü.'
  },
  {
    id: 'm3', propertyId: '', title: 'Çatı Su Yalıtımı Tamiri', type: 'emergency', status: 'completed',
    cost: 12000, provider: 'Yapı Güven Ltd.', date: '2025-03-05',
    notes: 'Yağmur sonrası sızıntı tespit edildi, derz dolgusu yapıldı.'
  },
  {
    id: 'm4', propertyId: '', title: 'Asansör Periyodik Bakımı', type: 'periodic', status: 'completed',
    cost: 3800, provider: 'Lift Servis', date: '2025-03-20', nextDate: '2025-09-20',
  },
  {
    id: 'm5', propertyId: '', title: 'Boya & Badana', type: 'routine', status: 'in_progress',
    cost: 8500, provider: 'Usta Mehmet', date: '2025-06-01',
    notes: 'Ortak alanlar ve merdiven boşluğu boyası.'
  },
  {
    id: 'm6', propertyId: '', title: 'Klima Bakımı', type: 'routine', status: 'planned',
    cost: 1800, provider: 'Klima Pro', date: '2025-07-01', nextDate: '2025-12-01',
  },
  {
    id: 'm7', propertyId: '', title: 'Su Tesisatı Kontrolü', type: 'periodic', status: 'planned',
    cost: 2500, provider: 'Tesisat Ustası Ali', date: '2025-07-15', nextDate: '2026-01-15',
  },
  {
    id: 'm8', propertyId: '', title: 'Yangın Tüpü Dolumu', type: 'periodic', status: 'planned',
    cost: 950, provider: 'Güvenlik Sistemleri A.Ş.', date: '2025-07-20', nextDate: '2026-07-20',
  },
  {
    id: 'm9', propertyId: '', title: 'Çatı Anten Tamiri', type: 'emergency', status: 'cancelled',
    cost: 600, provider: 'Anten Servis', date: '2025-04-10',
    notes: 'Kiracı tarafından iptal edildi.'
  },
  {
    id: 'm10', propertyId: '', title: 'Bahçe Sulama Sistemi Bakımı', type: 'routine', status: 'completed',
    cost: 1200, provider: 'Yeşil Bahçe', date: '2025-05-05', nextDate: '2025-11-05',
  },
];

interface MaintenanceStore {
  records: MaintenanceRecord[];
  addRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
  getByPropertyId: (propertyId: string) => MaintenanceRecord[];
}

export const useMaintenanceStore = create<MaintenanceStore>()(
  persist(
    (set, get) => ({
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
    }),
    { name: 'maintenance-storage-v1' }
  )
);
