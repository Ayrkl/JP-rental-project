import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell, RefreshCw, CheckCircle2, AlertTriangle, Info, BellOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNotificationStore, type Notification, type NotificationType } from '@/store/useNotificationStore';
import { useTranslation } from 'react-i18next';

type Tab = 'all' | 'read' | 'unread';

const TYPE_CONFIG: Record<NotificationType, { border: string; icon: React.ReactNode }> = {
  success: {
    border: 'border-l-emerald-500',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
  },
  info: {
    border: 'border-l-blue-500',
    icon: <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
  },
  warning: {
    border: 'border-l-amber-500',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
  },
};

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}dk önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa önce`;
  return `${Math.floor(hrs / 24)}g önce`;
};

const NotificationCard = ({ notif }: { notif: Notification }) => {
  const markAsRead = useNotificationStore(s => s.markAsRead);
  const cfg = TYPE_CONFIG[notif.type];

  return (
    <div
      onClick={() => markAsRead(notif.id)}
      className={`
        flex gap-3 px-4 py-3 cursor-pointer border-l-4 transition-colors
        hover:bg-white/5
        ${cfg.border}
        ${notif.status === 'unread' ? 'bg-white/[0.03]' : 'opacity-50'}
      `}
    >
      {cfg.icon}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-zinc-100 leading-snug">{notif.title}</p>
          {notif.status === 'unread' && (
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{notif.message}</p>
        <p className="text-[10px] text-zinc-600">{formatTime(notif.timestamp)}</p>
      </div>
    </div>
  );
};

export const NotificationSheet = () => {
  const [tab, setTab] = useState<Tab>('all');
  const { notifications, markAllAsRead } = useNotificationStore();
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const { t: tRaw } = useTranslation('navigation');
  const t = tRaw as unknown as (key: string) => string;

  const filtered = notifications.filter(n => {
    if (tab === 'read') return n.status === 'read';
    if (tab === 'unread') return n.status === 'unread';
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'read', label: 'Okundu' },
    { key: 'unread', label: 'Okunmadı' },
  ];

  return (
    <Popover.Root>
      {/* Trigger */}
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a] transition-colors focus:outline-none">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0a0a0a]" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-[9999] w-[420px] rounded-2xl border border-[#2a2a2a] bg-[#111111] shadow-2xl overflow-hidden
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[side=bottom]:slide-in-from-top-2
            focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
            <h3 className="text-base font-bold text-zinc-100">{t('notifications')}</h3>
            <button
              onClick={markAllAsRead}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#1e1e1e] transition-colors focus:outline-none"
              title={t('markAllRead')}
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-[#2a2a2a]">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                  tab === key
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1e1e1e]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Liste */}
          <ScrollArea className="max-h-[420px]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600">
                <BellOff size={28} />
                <p className="text-sm">Bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1e1e1e]">
                {filtered.map(n => (
                  <NotificationCard key={n.id} notif={n} />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="px-4 py-3 border-t border-[#2a2a2a]">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]"
                onClick={markAllAsRead}
              >
                <CheckCircle2 size={13} className="mr-1.5" />
                {t('markAllRead')}
              </Button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
