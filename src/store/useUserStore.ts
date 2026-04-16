import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStatus = 'active' | 'inactive';
export type UserRole = 'Super Admin' | 'Property Manager' | 'Tenant' | 'Accountant' | 'Viewer';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  roles: UserRole[];
  avatar?: string;
  dateAdded: string;
};

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'dateAdded'>) => void;
  updateUser: (id: string, user: Partial<Omit<User, 'id' | 'dateAdded'>>) => void;
  deleteUser: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Erol Ülgü', email: 'erol.ulgu@edusama.jp', phone: '+90 532 111 2233', status: 'active', roles: ['Super Admin'], dateAdded: '2024-01-10' },
  { id: '2', name: 'Selçuk Keskin', email: 'selcuk.keskin@edusama.jp', phone: '+90 533 222 3344', status: 'active', roles: ['Property Manager'], dateAdded: '2024-02-15' },
  { id: '3', name: 'Ayşe Demir', email: 'ayse.demir@edusama.jp', phone: '+90 535 333 4455', status: 'active', roles: ['Accountant'], dateAdded: '2024-03-01' },
  { id: '4', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@edusama.jp', phone: '+81 90 1234 5678', status: 'inactive', roles: ['Tenant'], dateAdded: '2024-03-20' },
  { id: '5', name: 'Fatma Çelik', email: 'fatma.celik@edusama.jp', phone: '+90 536 444 5566', status: 'active', roles: ['Property Manager', 'Viewer'], dateAdded: '2024-04-05' },
  { id: '6', name: 'Kemal Arslan', email: 'kemal.arslan@edusama.jp', phone: '+81 80 9876 5432', status: 'active', roles: ['Tenant'], dateAdded: '2024-04-18' },
  { id: '7', name: 'Zeynep Kaya', email: 'zeynep.kaya@edusama.jp', phone: '+90 537 555 6677', status: 'inactive', roles: ['Viewer'], dateAdded: '2024-05-02' },
  { id: '8', name: 'Hasan Öztürk', email: 'hasan.ozturk@edusama.jp', phone: '+90 538 666 7788', status: 'active', roles: ['Accountant', 'Viewer'], dateAdded: '2024-05-14' },
  { id: '9', name: 'Elif Şahin', email: 'elif.sahin@edusama.jp', phone: '+81 70 5555 4444', status: 'active', roles: ['Tenant'], dateAdded: '2024-06-01' },
  { id: '10', name: 'Burak Doğan', email: 'burak.dogan@edusama.jp', phone: '+90 539 777 8899', status: 'active', roles: ['Property Manager'], dateAdded: '2024-06-10' },
  { id: '11', name: 'Selin Aydın', email: 'selin.aydin@edusama.jp', phone: '+90 530 888 9900', status: 'inactive', roles: ['Tenant'], dateAdded: '2024-06-20' },
  { id: '12', name: 'Tarık Güneş', email: 'tarik.gunes@edusama.jp', phone: '+81 90 3333 2222', status: 'active', roles: ['Viewer'], dateAdded: '2024-07-01' },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: MOCK_USERS,

      addUser: (user) => set((state) => ({
        users: [
          { ...user, id: Math.random().toString(36).slice(2, 9), dateAdded: new Date().toISOString().split('T')[0] },
          ...state.users,
        ],
      })),

      updateUser: (id, updated) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updated } : u),
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id),
      })),

      toggleStatus: (id) => set((state) => ({
        users: state.users.map(u =>
          u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        ),
      })),
    }),
    { name: 'user-storage' }
  )
);
