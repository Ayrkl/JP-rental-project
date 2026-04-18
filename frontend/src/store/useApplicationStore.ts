import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    propertyId: '',
    propertyAddress: 'Shinjuku-ku, Tokyo, 160-0022',
    propertyPrice: 120000,
    status: 'submitted',
    submittedAt: '2025-06-01',
    updatedAt: '2025-06-01',
    fullName: 'Hiroshi Tanaka',
    birthDate: '1990-04-15',
    currentAddress: 'Shibuya-ku, Tokyo',
    residencyStatus: 'permanent_resident',
    occupation: 'Software Engineer',
    company: 'Tech Corp Japan',
    annualIncome: 6500000,
    workYears: 5,
    emergencyName: 'Keiko Tanaka',
    emergencyPhone: '+81 90 1111 2222',
    emergencyRelation: 'Eş',
    emergencyAddress: 'Shibuya-ku, Tokyo',
  },
  {
    id: 'app2',
    propertyId: '',
    propertyAddress: 'Minato-ku, Tokyo, 105-0001',
    propertyPrice: 95000,
    status: 'pre_approved',
    submittedAt: '2025-05-20',
    updatedAt: '2025-05-25',
    fullName: 'Yuki Nakamura',
    birthDate: '1995-08-22',
    currentAddress: 'Setagaya-ku, Tokyo',
    residencyStatus: 'work_visa',
    occupation: 'Designer',
    company: 'Creative Studio',
    annualIncome: 4200000,
    workYears: 3,
    emergencyName: 'Hana Nakamura',
    emergencyPhone: '+81 80 3333 4444',
    emergencyRelation: 'Anne',
    emergencyAddress: 'Osaka-shi, Osaka',
  },
  {
    id: 'app3',
    propertyId: '',
    propertyAddress: 'Chiyoda-ku, Tokyo, 100-0001',
    propertyPrice: 150000,
    status: 'docs_requested',
    submittedAt: '2025-06-05',
    updatedAt: '2025-06-07',
    fullName: 'Kenji Watanabe',
    birthDate: '1988-12-03',
    currentAddress: 'Nerima-ku, Tokyo',
    residencyStatus: 'citizen',
    occupation: 'Manager',
    company: 'Finance Ltd.',
    annualIncome: 8000000,
    workYears: 10,
    emergencyName: 'Yoko Watanabe',
    emergencyPhone: '+81 70 5555 6666',
    emergencyRelation: 'Eş',
    emergencyAddress: 'Nerima-ku, Tokyo',
  },
];

interface ApplicationStore {
  applications: Application[];
  draft: Partial<Application> | null;

  saveDraft: (data: Partial<Application>) => void;
  clearDraft: () => void;
  submitApplication: (app: Omit<Application, 'id' | 'updatedAt' | 'status'>) => string;
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
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
    }),
    { name: 'application-storage-v1' }
  )
);
