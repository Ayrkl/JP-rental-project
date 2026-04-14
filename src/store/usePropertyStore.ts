import { create } from 'zustand';

export type Property = {
  id: string;
  address: string;
  roomType: string;
  area: number;
  buildYear: number;
  quakeStandard: string;
  rooms: { id: string; type: string }[];
  dateAdded: Date;
};

interface PropertyStore {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'dateAdded'>) => void;
  removeProperty: (id: string) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [], // Global verilerimiz burada boş dizi olarak başlar
  
  addProperty: (property) => set((state) => ({
    properties: [
        { 
            ...property, 
            id: Math.random().toString(36).substr(2, 9), 
            dateAdded: new Date() 
        },
        ...state.properties, // Yeni ekleneni en başa koyarız
    ]
  })),
  
  removeProperty: (id) => set((state) => ({
    properties: state.properties.filter(p => p.id !== id)
  }))
}));
