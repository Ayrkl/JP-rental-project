import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DocumentType = 'Contract' | 'Insurance' | 'Rules' | 'Other';

export type Document = {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  fileUrl?: string;
  propertyId?: string;
  userId?: string;
};

interface DocumentStore {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByUserId: (userId: string) => Document[];
}

export const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Kira Sözleşmesi 2025.pdf', type: 'Contract', uploadDate: '2025-01-15', size: '2.4 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '2', name: 'Deprem Sigortası Poliçesi.pdf', type: 'Insurance', uploadDate: '2025-01-20', size: '1.8 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '3', name: 'Bina Kullanım Kılavuzu.pdf', type: 'Rules', uploadDate: '2025-01-22', size: '3.1 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '4', name: 'Yangın Sigortası 2025.pdf', type: 'Insurance', uploadDate: '2025-02-01', size: '0.9 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '5', name: 'Depozito Mutabakat Belgesi.pdf', type: 'Contract', uploadDate: '2025-02-10', size: '1.2 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '6', name: 'Çöp Toplama Takvimi.pdf', type: 'Rules', uploadDate: '2025-03-01', size: '0.4 MB', propertyId: 'prop1', userId: 'tenant1' },
  { id: '7', name: 'Kira Sözleşmesi 2024.pdf', type: 'Contract', uploadDate: '2024-01-10', size: '2.2 MB', propertyId: 'prop2', userId: 'admin' },
  { id: '8', name: 'Teslim Tutanağı.pdf', type: 'Other', uploadDate: '2024-01-12', size: '0.7 MB', propertyId: 'prop2', userId: 'admin' },
];

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: MOCK_DOCUMENTS,

      addDocument: (doc) => set((state) => ({
        documents: [
          { ...doc, id: Math.random().toString(36).slice(2, 9) },
          ...state.documents,
        ],
      })),

      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id),
      })),

      getDocumentsByUserId: (userId) => get().documents.filter(d => d.userId === userId),
    }),
    {
      name: 'document-storage-v2',
      version: 2,
      migrate: () => ({ documents: MOCK_DOCUMENTS }),
      onRehydrateStorage: () => (state) => {
        if (state && state.documents.length === 0) {
          state.documents = MOCK_DOCUMENTS;
        }
      },
    }
  )
);
