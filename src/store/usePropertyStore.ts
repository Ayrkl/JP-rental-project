import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  image?: string; // base64 (data URL) - demirbaş fotoğrafı
};

export type Property = {
  id: string;
  address: string;
  roomType: string;
  area: number;
  buildYear: number;
  quakeStandard: string;
  tenantCapacity: number;
  rooms: { id: string; type: 'Room' | 'Living' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Toilet' | 'Balcony' | 'Storage' }[];
  images: string[];
  features: string[]; // Yeni: İmkanlar (İnternet, Asansör vs)
  inventory: InventoryItem[]; // Yeni: Demirbaş Eşyalar
  dateAdded: string;
  coordinates?: { lat: number; lng: number }; // Harita entegrasyonu için
};

interface PropertyStore {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'dateAdded'>) => void;
  updateProperty: (id: string, property: Omit<Property, 'id' | 'dateAdded'>) => void;
  removeProperty: (id: string) => void;
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
                dateAdded: new Date().toISOString() 
            },
            ...state.properties, 
        ]
      })),

      updateProperty: (id, updatedProp) => set((state) => ({
        properties: state.properties.map(p => p.id === id ? { ...p, ...updatedProp } : p)
      })),
      
      removeProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== id)
      }))
    }),
    {
      name: 'property-storage', // Tarayıcı LocalStorage anahtarı
    }
  )
);
