import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Shield, Wrench, AlertTriangle, Plus, Download, X, Calendar, DollarSign
} from 'lucide-react';
import { useMaintenanceStore, type MaintenanceType, type MaintenanceStatus } from '@/store/useMaintenanceStore';
import { useAccountingStore } from '@/store/useAccountingStore';
interface MaintenanceTimelineProps {
  propertyId: string;
}

const TYPE_CONFIG: Record<MaintenanceType, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  periodic:  { label: 'Periyodik Kontrol', color: 'text-blue-400',   dot: 'bg-blue-400',   icon: Shield },
  routine:   { label: 'Rutin Bakım',       color: 'text-indigo-400', dot: 'bg-indigo-400', icon: Wrench },
  emergency: { label: 'Acil Tamir',        color: 'text-rose-500',   dot: 'bg-rose-500',   icon: AlertTriangle },
};

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; cls: string }> = {
  planned:     { label: 'Planlandı',    cls: 'text-amber-400 bg-amber-400/10 border border-amber-400/20' },
  in_progress: { label: 'Devam Ediyor', cls: 'text-blue-400 bg-blue-400/10 border border-blue-400/20' },
  completed:   { label: 'Tamamlandı',   cls: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' },
  cancelled:   { label: 'İptal Edildi', cls: 'text-zinc-400 bg-zinc-400/10 border border-zinc-400/20' },
};

const EMPTY_FORM = {
  title: '',
  type: 'periodic' as MaintenanceType,
  status: 'planned' as MaintenanceStatus,
  cost: '',
  provider: '',
  date: '',
  nextDate: '',
  notes: '',
  addToAccounting: false,
};

function isWithin30Days(dateStr?: string): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 30;
}

export const MaintenanceTimeline = ({ propertyId }: MaintenanceTimelineProps) => {
  const { records, addRecord, getByPropertyId } = useMaintenanceStore();
  const addPayment = useAccountingStore((s) => s.approvePayment);
  void addPayment; // muhasebe entegrasyonu setState üzerinden yapılıyor

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // propertyId boş string olan kayıtlar da bu mülke ait sayılır (mock veri uyumu)
  const items = records.filter((r) => r.propertyId === propertyId || r.propertyId === '');

  const upcomingAlerts = items.filter(
    (r) => r.status !== 'completed' && isWithin30Days(r.nextDate)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      propertyId,
      title: form.title,
      type: form.type,
      status: form.status,
      cost: Number(form.cost) || 0,
      provider: form.provider,
      date: form.date,
      nextDate: form.nextDate || undefined,
      notes: form.notes || undefined,
    };
    addRecord(newRecord);

    if (form.addToAccounting) {
      useAccountingStore.setState((state) => ({
        payments: [
          {
            id: Math.random().toString(36).slice(2, 9),
            propertyId,
            tenantName: form.provider,
            description: form.title,
            amount: Number(form.cost) || 0,
            dueDate: form.date,
            status: 'paid',
            paidAt: form.date,
          },
          ...state.payments,
        ],
      }));
    }

    setForm(EMPTY_FORM);
    setOpen(false);
  };

  const handlePdfDownload = () => {
    console.log('[MaintenanceTimeline] PDF İndir tıklandı — propertyId:', propertyId, 'kayıtlar:', items);
  };

  return (
    <div className="space-y-4">
      {/* Uyarı Banner */}
      {upcomingAlerts.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{upcomingAlerts.length} bakım yaklaşıyor (30 gün içinde)</span>
        </div>
      )}

      {/* Başlık Satırı */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Bakım Tarihçesi</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePdfDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Download size={13} /> PDF İndir
          </button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-400/30 transition-all">
                <Plus size={13} /> Kayıt Ekle
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
              <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-base font-bold text-zinc-100">Yeni Bakım Kaydı</Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-zinc-500 hover:text-zinc-200 transition-colors">
                      <X size={18} />
                    </button>
                  </Dialog.Close>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Başlık */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 font-medium">Başlık</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                      placeholder="Bakım başlığı..."
                    />
                  </div>

                  {/* Tip & Durum */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Tip</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as MaintenanceType })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="periodic">Periyodik Kontrol</option>
                        <option value="routine">Rutin Bakım</option>
                        <option value="emergency">Acil Tamir</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Durum</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as MaintenanceStatus })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="planned">Planlandı</option>
                        <option value="in_progress">Devam Ediyor</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </div>
                  </div>

                  {/* Maliyet & Usta/Firma */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Maliyet (₺)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.cost}
                        onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Usta / Firma</label>
                      <input
                        required
                        value={form.provider}
                        onChange={(e) => setForm({ ...form, provider: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        placeholder="Firma adı..."
                      />
                    </div>
                  </div>

                  {/* Tarih & Sonraki Tarih */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Tarih</label>
                      <input
                        required
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-medium">Sonraki Bakım</label>
                      <input
                        type="date"
                        value={form.nextDate}
                        onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  {/* Notlar */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 font-medium">Notlar</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
                      placeholder="Ek notlar..."
                    />
                  </div>

                  {/* Muhasebeye Ekle */}
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.addToAccounting}
                      onChange={(e) => setForm({ ...form, addToAccounting: e.target.checked })}
                      className="w-4 h-4 rounded accent-indigo-500"
                    />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      Muhasebeye Gider Olarak Ekle
                    </span>
                  </label>

                  <div className="flex justify-end gap-2 pt-1">
                    <Dialog.Close asChild>
                      <button type="button" className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        İptal
                      </button>
                    </Dialog.Close>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all">
                      Kaydet
                    </button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* Timeline */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-white/5 rounded-full mb-3">
            <Wrench className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-500">Henüz bakım kaydı bulunmuyor.</p>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* Dikey çizgi */}
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10" />

          <div className="space-y-4">
            {items.map((record) => {
              const typeConf = TYPE_CONFIG[record.type];
              const statusConf = STATUS_CONFIG[record.status];
              const Icon = typeConf.icon;

              return (
                <div key={record.id} className="relative">
                  {/* Nokta */}
                  <div className={`absolute -left-[15px] top-4 w-3 h-3 rounded-full border-2 border-[#111] ${typeConf.dot}`} />

                  {/* Kart */}
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 space-y-2 hover:bg-white/[0.07] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={typeConf.color} />
                        <span className="text-sm font-semibold text-zinc-100">{record.title}</span>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusConf.cls}`}>
                        {statusConf.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span className={`font-medium ${typeConf.color}`}>{typeConf.label}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {record.date}
                      </span>
                      {record.nextDate && (
                        <span className={`flex items-center gap-1 ${isWithin30Days(record.nextDate) ? 'text-amber-400' : ''}`}>
                          <Calendar size={11} /> Sonraki: {record.nextDate}
                          {isWithin30Days(record.nextDate) && ' ⚠️'}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <DollarSign size={11} /> {record.cost.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500">
                      Usta/Firma: <span className="text-zinc-300">{record.provider}</span>
                    </div>

                    {record.notes && (
                      <p className="text-xs text-zinc-500 italic border-t border-white/5 pt-2">{record.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
