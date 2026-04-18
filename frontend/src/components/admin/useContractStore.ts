import { create } from 'zustand';

export type ContractStatus = 'Taslak' | 'Aktif' | 'Sona Erdi' | 'Feshedildi';

export type Contract = {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  paymentDay: number;
  status: ContractStatus;
  notes?: string;
  dateAdded: string;
};

interface ContractStore {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'dateAdded'>) => void;
  updateContract: (id: string, contract: Omit<Contract, 'id' | 'dateAdded'>) => void;
  removeContract: (id: string) => void;
}

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [],

  addContract: (contract) =>
    set((state) => ({
      contracts: [
        {
          ...contract,
          id: Math.random().toString(36).slice(2, 9),
          dateAdded: new Date().toISOString(),
        },
        ...state.contracts,
      ],
    })),

  updateContract: (id, updatedContract) =>
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, ...updatedContract } : c)),
    })),

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    })),
}));
