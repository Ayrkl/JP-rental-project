import { create } from 'zustand';

export type ApplicationStatus = 'draft' | 'submitted' | 'pre_approved' | 'docs_requested' | 'rejected';

export type ResidencyStatus = 'citizen' | 'permanent_resident' | 'work_visa' | 'student_visa' | 'other';

export type Application = {
  id: string;
  propertyId: string;
  propertyAddress?: string;
  propertyPrice?: number;
  status: ApplicationStatus;
  submittedAt?: string;
  updatedAt: string;

  // Aşama 1 — Kişisel
  fullName: string;
  birthDate: string;
  currentAddress: string;
  residencyStatus: ResidencyStatus;

  // Aşama 2 — İş & Gelir
  occupation: string;
  company: string;
  annualIncome: number;
  workYears: number;

  // Aşama 3 — Belgeler (base64 veya blob URL)
  idFront?: string;
  idBack?: string;
  incomeDocs?: string[];

  // Aşama 4 — Acil İletişim
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  emergencyAddress: string;

  // Admin notları
  adminNote?: string;
};

// Güven skoru hesapla: yıllık gelir / (aylık kira * 12)
export const calcTrustScore = (annualIncome: number, monthlyRent: number): number => {
  if (!monthlyRent) return 0;
  return Math.min(100, Math.round((annualIncome / (monthlyRent * 12)) * 33));
};

const MOCK_APPLICATIONS: Application[] = [];

interface ApplicationStore {
  applications: Application[];
  draft: Partial<Application> | null;

  saveDraft: (data: Partial<Application>) => void;
  clearDraft: () => void;
  submitApplication: (app: Omit<Application, 'id' | 'updatedAt' | 'status'>) => string;
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: MOCK_APPLICATIONS,
  draft: null,

  saveDraft: (data) =>
    set((state) => ({ draft: { ...state.draft, ...data } })),

  clearDraft: () => set({ draft: null }),

  submitApplication: (app) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({
      applications: [
        {
          ...app,
          id,
          status: 'submitted',
          updatedAt: new Date().toISOString(),
        },
        ...state.applications,
      ],
      draft: null,
    }));
    return id;
  },

  updateStatus: (id, status, note) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? { ...a, status, adminNote: note ?? a.adminNote, updatedAt: new Date().toISOString() }
          : a
      ),
    })),
}));
