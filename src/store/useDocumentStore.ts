import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DocumentType = 'Contract' | 'Insurance' | 'Rules' | 'Other';

export type PropertyDocument = {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  recipientId: string;
  propertyId?: string;
  fileData?: string; // base64 veya mock URL
};

export type DocumentTemplate = {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  description: string;
};

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  { id: 't1', name: 'Kira Sözleşmesi 2025.pdf',       type: 'Contract',  size: '2.4 MB', description: 'Standart yıllık kira sözleşmesi' },
  { id: 't2', name: 'Depozito Mutabakat Belgesi.pdf',  type: 'Contract',  size: '1.2 MB', description: 'Depozito ödeme ve iade koşulları' },
  { id: 't3', name: 'Deprem Sigortası Poliçesi.pdf',   type: 'Insurance', size: '1.8 MB', description: 'Zorunlu deprem sigortası (DASK)' },
  { id: 't4', name: 'Yangın Sigortası 2025.pdf',       type: 'Insurance', size: '0.9 MB', description: 'Yangın ve doğal afet sigortası' },
  { id: 't5', name: 'Bina Kullanım Kılavuzu.pdf',      type: 'Rules',     size: '3.1 MB', description: 'Bina kuralları ve ortak alan kullanımı' },
  { id: 't6', name: 'Çöp Toplama Takvimi.pdf',         type: 'Rules',     size: '0.4 MB', description: 'Haftalık çöp takvimi ve ayrıştırma kuralları' },
  { id: 't7', name: 'Acil Durum Prosedürleri.pdf',     type: 'Rules',     size: '0.6 MB', description: 'Yangın ve deprem anında yapılacaklar' },
  { id: 't8', name: 'Teslim Tutanağı.pdf',             type: 'Other',     size: '0.7 MB', description: 'Mülk teslim ve iade tutanağı' },
];

export type SendDocumentPayload = Omit<PropertyDocument, 'id'>;

interface DocumentStore {
  documents: PropertyDocument[];
  sendDocument: (payload: SendDocumentPayload) => void;
  deleteDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: [],

      sendDocument: (payload) =>
        set((state) => ({
          documents: [
            { ...payload, id: Math.random().toString(36).slice(2, 9) },
            ...state.documents,
          ],
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
    }),
    { name: 'property-document-storage-v2' }
  )
);
