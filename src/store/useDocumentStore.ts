import { create } from 'zustand';

export type DocumentType = 'Contract' | 'Insurance' | 'Rules' | 'Other';

// Belge veri modeli
export type PropertyDocument = {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  recipientId: string; // hangi kullanıcıya gönderildi
};

// Admin'in seçebileceği önceden hazırlanmış şablon belgeler
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

const INITIAL_DOCUMENTS: PropertyDocument[] = [];

interface DocumentStore {
  /** Gönderilmiş belgeler */
  documents: PropertyDocument[];
  /** Admin bir şablonu seçilen kullanıcıya gönderir */
  sendDocument: (templateId: string, recipientId: string) => void;
  /** Admininin gönderdiği bir belgeyi geri alması */
  deleteDocument: (id: string) => void;
}

import { persist } from 'zustand/middleware';

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: INITIAL_DOCUMENTS,

      sendDocument: (templateId, recipientId) => {
        const template = DOCUMENT_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;
        set((state) => ({
          documents: [
            {
              id: Math.random().toString(36).slice(2, 9),
              name: template.name,
              type: template.type,
              size: template.size,
              uploadDate: new Date().toISOString().split('T')[0],
              recipientId,
            },
            ...state.documents,
          ],
        }));
      },

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
    }),
    { name: 'property-document-storage' }
  )
);
