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
  { id: '1', name: 'Hiroshi Tanaka', email: 'h.tanaka@edusama.jp', phone: '+81 90 1234 5678', status: 'active', roles: ['Super Admin'], dateAdded: '2024-01-10' },
  { id: '2', name: 'Yuki Nakamura', email: 'y.nakamura@edusama.jp', phone: '+81 80 2345 6789', status: 'active', roles: ['Property Manager'], dateAdded: '2024-02-15' },
  { id: '3', name: 'Kenji Watanabe', email: 'k.watanabe@edusama.jp', phone: '+81 70 3456 7890', status: 'inactive', roles: ['Accountant'], dateAdded: '2024-03-01' },
  { id: '4', name: 'Aiko Suzuki', email: 'a.suzuki@edusama.jp', phone: '+81 90 4567 8901', status: 'active', roles: ['Tenant'], dateAdded: '2024-03-20' },
  { id: '5', name: 'Takeshi Yamamoto', email: 't.yamamoto@edusama.jp', phone: '+81 80 5678 9012', status: 'active', roles: ['Property Manager', 'Viewer'], dateAdded: '2024-04-05' },
  { id: '6', name: 'Sakura Ito', email: 's.ito@edusama.jp', phone: '+81 70 6789 0123', status: 'inactive', roles: ['Tenant'], dateAdded: '2024-04-18' },
  { id: '7', name: 'Ryo Kobayashi', email: 'r.kobayashi@edusama.jp', phone: '+81 90 7890 1234', status: 'active', roles: ['Viewer'], dateAdded: '2024-05-02' },
  { id: '8', name: 'Mika Kato', email: 'm.kato@edusama.jp', phone: '+81 80 8901 2345', status: 'active', roles: ['Accountant', 'Viewer'], dateAdded: '2024-05-14' },
  { id: '9', name: 'Daiki Hayashi', email: 'd.hayashi@edusama.jp', phone: '+81 70 9012 3456', status: 'active', roles: ['Tenant'], dateAdded: '2024-06-01' },
  { id: '10', name: 'Nana Kimura', email: 'n.kimura@edusama.jp', phone: '+81 90 0123 4567', status: 'inactive', roles: ['Property Manager'], dateAdded: '2024-06-10' },
  { id: '11', name: 'Sora Matsumoto', email: 's.matsumoto@edusama.jp', phone: '+81 80 1122 3344', status: 'active', roles: ['Tenant'], dateAdded: '2024-06-20' },
  { id: '12', name: 'Hana Inoue', email: 'h.inoue@edusama.jp', phone: '+81 70 2233 4455', status: 'active', roles: ['Viewer'], dateAdded: '2024-07-01' },
  { id: '13', name: 'Hiroshi Tanaka', email: 'h.tanaka@edusama.jp', phone: '+81 90 1234 5678', status: 'active', roles: ['Super Admin'], dateAdded: '2024-01-10' },
  { id: '14', name: 'Yuki Nakamura', email: 'y.nakamura@edusama.jp', phone: '+81 80 2345 6789', status: 'active', roles: ['Property Manager'], dateAdded: '2024-02-15' },
  { id: '15', name: 'Kenji Watanabe', email: 'k.watanabe@edusama.jp', phone: '+81 70 3456 7890', status: 'inactive', roles: ['Accountant'], dateAdded: '2024-03-01' },
  { id: '16', name: 'Aiko Suzuki', email: 'a.suzuki@edusama.jp', phone: '+81 90 4567 8901', status: 'active', roles: ['Tenant'], dateAdded: '2024-03-20' },
  { id: '17', name: 'Takeshi Yamamoto', email: 't.yamamoto@edusama.jp', phone: '+81 80 5678 9012', status: 'active', roles: ['Property Manager', 'Viewer'], dateAdded: '2024-04-05' },
  { id: '18', name: 'Sakura Ito', email: 's.ito@edusama.jp', phone: '+81 70 6789 0123', status: 'inactive', roles: ['Tenant'], dateAdded: '2024-04-18' },
  { id: '19', name: 'Ryo Kobayashi', email: 'r.kobayashi@edusama.jp', phone: '+81 90 7890 1234', status: 'active', roles: ['Viewer'], dateAdded: '2024-05-02' },
  { id: '20', name: 'Mika Kato', email: 'm.kato@edusama.jp', phone: '+81 80 8901 2345', status: 'active', roles: ['Accountant', 'Viewer'], dateAdded: '2024-05-14' },
  { id: '21', name: 'Daiki Hayashi', email: 'd.hayashi@edusama.jp', phone: '+81 70 9012 3456', status: 'active', roles: ['Tenant'], dateAdded: '2024-06-01' },
  { id: '22', name: 'Nana Kimura', email: 'n.kimura@edusama.jp', phone: '+81 90 0123 4567', status: 'inactive', roles: ['Property Manager'], dateAdded: '2024-06-10' },
  { id: '23', name: 'Sora Matsumoto', email: 's.matsumoto@edusama.jp', phone: '+81 80 1122 3344', status: 'active', roles: ['Tenant'], dateAdded: '2024-06-20' },
  { id: '24', name: 'Hana Inoue', email: 'h.inoue@edusama.jp', phone: '+81 70 2233 4455', status: 'active', roles: ['Viewer'], dateAdded: '2024-07-01' },
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
