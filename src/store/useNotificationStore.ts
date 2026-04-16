import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning';
export type NotificationStatus = 'unread' | 'read';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  timestamp: string;
};

interface NotificationStore {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'status' | 'timestamp'>) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'Kira Tahsil Edildi',
      message: 'Haziran 2025 kira ödemesi başarıyla alındı. ¥120,000',
      type: 'success',
      status: 'unread',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      title: 'Haziran Ayı Elektrik Faturası Yüklendi',
      message: 'Elektrik faturanız sisteme eklendi. ¥8,200 — Son ödeme: 15 Temmuz.',
      type: 'info',
      status: 'unread',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: '3',
      title: 'Sözleşme Süreniz Dolmak Üzere',
      message: 'Kira sözleşmeniz 30 gün içinde sona erecek. Yenileme için yöneticinizle iletişime geçin.',
      type: 'warning',
      status: 'unread',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'read' } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, status: 'read' })),
    })),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: Math.random().toString(36).slice(2, 9),
          status: 'unread',
          timestamp: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
}));
