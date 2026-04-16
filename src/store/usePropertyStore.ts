import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InventoryCondition = 'new' | 'used' | 'damaged';

export type GarbageDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type GarbageSchedule = {
  burnable: GarbageDay[];
  nonBurnable: GarbageDay[];
  recyclable: GarbageDay[];
};

export type PropertyLogistics = {
  keyHandoverNote?: string;
  smartLockCode?: string;
  mailboxNumber?: string;
  garbageSchedule?: GarbageSchedule;
};

export type PropertyStatus = 'available' | 'leased' | 'overdue' | 'eviction' | 'maintenance';

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  image?: string;
  condition: InventoryCondition;
  warrantyExpiry?: string;
  deliveryPhoto?: string;
};

export type Property = {
  id: string;
  address: string;
  roomType: string;
  area: number;
  buildYear: number;
  quakeStandard: string;
  tenantCapacity: number;
  price?: number;
  rooms: { id: string; type: 'Room' | 'Living' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Toilet' | 'Balcony' | 'Storage' }[];
  images: string[];
  features: string[];
  inventory: InventoryItem[];
  dateAdded: string;
  coordinates?: { lat: number; lng: number };
  logistics?: PropertyLogistics;
  status: PropertyStatus;
  statusChangedAt?: string;
};

interface PropertyStore {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'dateAdded'>) => void;
  updateProperty: (id: string, property: Omit<Property, 'id' | 'dateAdded'>) => void;
  removeProperty: (id: string) => void;
}

const STATUS_TRANSITIONS: Record<PropertyStatus, PropertyStatus[]> = {
  available:   ['leased', 'maintenance'],
  leased:      ['overdue', 'maintenance'],
  overdue:     ['eviction', 'leased'],
  eviction:    ['maintenance'],
  maintenance: ['available'],
};

function isValidTransition(from: PropertyStatus, to: PropertyStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      properties: [],

      addProperty: (property) => set((state) => ({
        properties: [
          {
            ...property,
            id: Math.random().toString(36).substr(2, 9),
            dateAdded: new Date().toISOString(),
            status: 'available' as const,
            statusChangedAt: new Date().toISOString(),
          },
          ...state.properties,
        ],
      })),

      updateProperty: (id, updatedProp) => set((state) => {
        const existing = state.properties.find(p => p.id === id);
        if (existing && updatedProp.status && updatedProp.status !== existing.status) {
          if (!isValidTransition(existing.status, updatedProp.status)) {
            throw new Error(`Geçersiz durum geçişi: ${existing.status} → ${updatedProp.status}`);
          }
        }
        return {
          properties: state.properties.map(p => p.id === id ? { ...p, ...updatedProp } : p),
        };
      }),

      removeProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== id),
      })),
    }),
    {
      name: 'property-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.properties = state.properties.map(p => ({
            ...p,
            status: p.status ?? 'available',
            logistics: p.logistics ?? {},
          }));
        }
      },
    }
  )
);
