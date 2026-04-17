import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle, XCircle, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import {
  useAccountingStore, calcInitialCost, calcUtilityBill,
  type PaymentStatus,
} from '@/store/useAccountingStore';
import { usePropertyStore } from '@/store/usePropertyStore';

// ── Yardımcı ──────────────────────────────────────────────────────────────

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Ödendi', pending: 'Onay Bekliyor', unpaid: 'Ödenmedi', overdue: 'Gecikmiş',
};
const STATUS_COLOR: Record<PaymentStatus, string> = {
  paid: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  unpaid: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  overdue: 'text-rose-600 bg-rose-600/10 border-rose-600/20',
};

const glass = 'bg-white/5 backdrop-blur border border-white/10 rounded-xl';

// ── Stat Kartı ─────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, sub }: { label: string; value: string; icon: React.ReactNode; sub?: string }) {
  return (
    <div className={`${glass} p-5 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-zinc-500">{icon}</span>
      </div>
      <span className="text-2xl font-bold text-zinc-100">{value}</span>
      {sub && <span className="text-xs text-zinc-500">{sub}</span>}
    </div>
  );
}

// ── Ödemeler Tab ───────────────────────────────────────────────────────────

type FilterKey = 'all' | PaymentStatus;

const FILTERS: { key: FilterKey; label: string; color: string }[] = [
  { key: 'all',     label: 'Hepsi',          color: 'text-zinc-300 border-zinc-600 hover:border-zinc-400' },
  { key: 'unpaid',  label: 'Ödenmedi',        color: 'text-rose-500 border-rose-500/40 hover:border-rose-500' },
  { key: 'pending', label: 'Onay Bekliyor',   color: 'text-amber-400 border-amber-400/40 hover:border-amber-400' },
  { key: 'overdue', label: 'Gecikmiş',        color: 'text-rose-600 border-rose-600/40 hover:border-rose-600' },
  { key: 'paid',    label: 'Ödendi',          color: 'text-emerald-400 border-emerald-400/40 hover:border-emerald-400' },
];

function PaymentsTab() {
  const { payments, approvePayment, rejectPayment } = useAccountingStore();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const confirmTarget = payments.find(p => p.id === confirmId);

  function handleApprove() {
    if (!confirmId) return;
    approvePayment(confirmId);
    setConfirmed(true);
  }

  function handleClose() {
    setConfirmId(null);
    setConfirmed(false);
  }

  return (
    <div className="space-y-4">
      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${f.color} ${filter === f.key ? 'bg-white/10' : 'bg-transparent'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className={`${glass} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500 text-xs">
              <th className="text-left px-4 py-3">Kiracı</th>
              <th className="text-left px-4 py-3">Açıklama</th>
              <th className="text-right px-4 py-3">Tutar</th>
              <th className="text-left px-4 py-3">Vade</th>
              <th className="text-left px-4 py-3">Durum</th>
              <th className="text-right px-4 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-zinc-200 font-medium">{p.tenantName}</td>
                <td className="px-4 py-3 text-zinc-400">{p.description}</td>
                <td className="px-4 py-3 text-right text-zinc-100 font-mono">{yen(p.amount)}</td>
                <td className="px-4 py-3 text-zinc-400">{p.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {(p.status === 'pending' || p.status === 'unpaid') && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
                      >
                        <CheckCircle size={13} /> Onayla
                      </button>
                      <button
                        onClick={() => rejectPayment(p.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs hover:bg-rose-500/20 transition-colors"
                      >
                        <XCircle size={13} /> Reddet
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 py-8 text-sm">Kayıt bulunamadı.</p>
        )}
      </div>

      {/* Onay Modalı */}
      <Dialog.Root open={!!confirmId} onOpenChange={open => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#111]/90 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
            {!confirmed ? (
              <>
                <Dialog.Title className="text-lg font-semibold text-zinc-100 mb-1">Ödemeyi Onayla</Dialog.Title>
                <Dialog.Description className="text-sm text-zinc-400 mb-5">
                  Bu işlem geri alınamaz. Ödeme onaylandığında durum <span className="text-emerald-400">Ödendi</span> olarak güncellenecek.
                </Dialog.Description>
                {confirmTarget && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-zinc-400">Kiracı</span><span className="text-zinc-100">{confirmTarget.tenantName}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-400">Açıklama</span><span className="text-zinc-100">{confirmTarget.description}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-400">Tutar</span><span className="text-emerald-400 font-mono font-semibold">{yen(confirmTarget.amount)}</span></div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleApprove} className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors">
                    Onayla
                  </button>
                  <Dialog.Close asChild>
                    <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium hover:bg-white/10 transition-colors">
                      İptal
                    </button>
                  </Dialog.Close>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle size={48} className="text-emerald-400 mx-auto" />
                <p className="text-lg font-semibold text-zinc-100">Payment Received</p>
                <p className="text-sm text-zinc-400">Ödeme başarıyla onaylandı.</p>
                <button onClick={handleClose} className="mt-2 px-6 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                  Kapat
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ── Başlangıç Maliyetleri Tab ──────────────────────────────────────────────

function InitialCostsTab() {
  const { addInitialCost } = useAccountingStore();
  const { properties } = usePropertyStore();

  const [tenantName, setTenantName] = useState('');
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [reikinMonths, setReikinMonths] = useState(1);
  const [shikikinMonths, setShikikinMonths] = useState(2);
  const [agencyFeeMonths, setAgencyFeeMonths] = useState(1);
  const [insurance, setInsurance] = useState(0);
  const [propertyId, setPropertyId] = useState('');

  const draft = { id: '', propertyId, tenantName, monthlyRent, reikinMonths, shikikinMonths, agencyFeeMonths, insurance, createdAt: '' };
  const calc = calcInitialCost(draft);

  function handleSave() {
    if (!tenantName || !monthlyRent) return;
    addInitialCost({ propertyId, tenantName, monthlyRent, reikinMonths, shikikinMonths, agencyFeeMonths, insurance });
    setTenantName(''); setMonthlyRent(0); setInsurance(0);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className={`${glass} p-6 lg:col-span-2 space-y-5`}>
        <h3 className="text-sm font-semibold text-zinc-300">Başlangıç Maliyeti Ekle</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Kiracı Adı</label>
            <input value={tenantName} onChange={e => setTenantName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30"
              placeholder="Kiracı adı..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Mülk</label>
            <select value={propertyId} onChange={e => setPropertyId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30">
              <option value="">Seçiniz</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Aylık Kira (¥)</label>
            <input type="number" value={monthlyRent || ''} onChange={e => setMonthlyRent(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30"
              placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Sigorta Bedeli (¥)</label>
            <input type="number" value={insurance || ''} onChange={e => setInsurance(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30"
              placeholder="0" />
          </div>
        </div>

        {/* Çarpan Sliderları */}
        {[
          { label: '礼金 Reikin (ay)', value: reikinMonths, set: setReikinMonths },
          { label: '敷金 Shikikin (ay)', value: shikikinMonths, set: setShikikinMonths },
          { label: '仲介手数料 Komisyon (ay)', value: agencyFeeMonths, set: setAgencyFeeMonths },
        ].map(({ label, value, set }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">{label}</label>
              <span className="text-xs text-zinc-300 font-mono">{value} ay → {yen(monthlyRent * value)}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={6} step={0.5} value={value}
                onChange={e => set(Number(e.target.value))}
                className="flex-1 accent-indigo-500" />
              <input type="number" min={0} max={6} step={0.5} value={value}
                onChange={e => set(Number(e.target.value))}
                className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-100 text-center focus:outline-none" />
            </div>
          </div>
        ))}

        <button onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors text-sm">
          Kaydet
        </button>
      </div>

      {/* Özet */}
      <div className={`${glass} p-6 space-y-4`}>
        <h3 className="text-sm font-semibold text-zinc-300">Canlı Özet</h3>
        {[
          { label: 'Aylık Kira', value: monthlyRent },
          { label: '礼金 Reikin', value: calc.reikin },
          { label: '敷金 Shikikin', value: calc.shikikin },
          { label: '仲介手数料 Komisyon', value: calc.agency },
          { label: 'Sigorta', value: insurance },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-zinc-400">{row.label}</span>
            <span className="text-zinc-200 font-mono">{yen(row.value)}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-3 flex justify-between">
          <span className="text-zinc-300 font-semibold">Toplam</span>
          <span className="text-emerald-400 font-bold font-mono text-lg">{yen(calc.total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Sayaç Yönetimi Tab ─────────────────────────────────────────────────────

type UtilityField = { prev: number; curr: number; unitPrice: number; fixed: number };
const emptyField = (): UtilityField => ({ prev: 0, curr: 0, unitPrice: 0, fixed: 0 });

function UtilityInput({ label, unit, value, onChange }: {
  label: string; unit: string;
  value: UtilityField;
  onChange: (v: UtilityField) => void;
}) {
  const bill = (value.curr - value.prev) * value.unitPrice + value.fixed;
  const fields: { key: keyof UtilityField; label: string }[] = [
    { key: 'prev', label: 'Önceki Okuma' },
    { key: 'curr', label: 'Güncel Okuma' },
    { key: 'unitPrice', label: 'Birim Fiyat (¥)' },
    { key: 'fixed', label: 'Sabit Bedel (¥)' },
  ];
  return (
    <div className={`${glass} p-5 space-y-3`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-zinc-200">{label}</h4>
        <span className="text-xs text-zinc-500">{unit}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className="space-y-1">
            <label className="text-xs text-zinc-500">{f.label}</label>
            <input type="number" value={value[f.key] || ''}
              onChange={e => onChange({ ...value, [f.key]: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-white/30" />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-1 border-t border-white/10">
        <span className="text-xs text-zinc-400">Hesaplanan Tutar</span>
        <span className="text-sm font-mono font-semibold text-emerald-400">{yen(Math.max(0, bill))}</span>
      </div>
    </div>
  );
}

function UtilityTab() {
  const { addUtilityReading } = useAccountingStore();
  const { properties } = usePropertyStore();
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [electricity, setElectricity] = useState<UtilityField>(emptyField());
  const [water, setWater] = useState<UtilityField>(emptyField());
  const [gas, setGas] = useState<UtilityField>(emptyField());

  const bills = calcUtilityBill({ id: '', propertyId, month, electricity, water, gas });

  function handleSave() {
    addUtilityReading({ propertyId, month, electricity, water, gas });
    setElectricity(emptyField()); setWater(emptyField()); setGas(emptyField());
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Mülk</label>
          <select value={propertyId} onChange={e => setPropertyId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30">
            <option value="">Seçiniz</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Ay</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-white/30" />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-zinc-300">Ayın Sayaçlarını Gir</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UtilityInput label="Elektrik" unit="kWh" value={electricity} onChange={setElectricity} />
        <UtilityInput label="Su" unit="m³" value={water} onChange={setWater} />
        <UtilityInput label="Gaz" unit="m³" value={gas} onChange={setGas} />
      </div>

      {/* Toplam */}
      <div className={`${glass} p-5 flex flex-wrap gap-6 items-center justify-between`}>
        <div className="flex gap-6">
          {[
            { label: 'Elektrik', value: bills.elec },
            { label: 'Su', value: bills.water },
            { label: 'Gaz', value: bills.gas },
          ].map(b => (
            <div key={b.label} className="text-center">
              <p className="text-xs text-zinc-500">{b.label}</p>
              <p className="text-sm font-mono text-zinc-200">{yen(b.value)}</p>
            </div>
          ))}
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400">Toplam</p>
          <p className="text-xl font-bold font-mono text-emerald-400">{yen(bills.total)}</p>
        </div>
        <button onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors text-sm">
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ── Ana Bileşen ────────────────────────────────────────────────────────────

type TabKey = 'payments' | 'initialCosts' | 'utility';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'payments',     label: 'Ödemeler' },
  { key: 'initialCosts', label: 'Başlangıç Maliyetleri' },
  { key: 'utility',      label: 'Sayaç Yönetimi' },
];

export function Accounting() {
  const { payments, chartData } = useAccountingStore();
  const [tab, setTab] = useState<TabKey>('payments');

  // Stat hesaplamaları
  const totalExpected = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid     = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const overdue       = payments.filter(p => p.status === 'overdue').length;
  const pending       = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6 text-zinc-100">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Muhasebe</h1>
        <p className="text-sm text-zinc-500 mt-1">Tahsilat takibi, başlangıç maliyetleri ve sayaç yönetimi</p>
      </div>

      {/* Stat Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Toplam Beklenen Tahsilat" value={yen(totalExpected)} icon={<TrendingUp size={18} />} />
        <StatCard label="Gerçekleşen Tahsilat" value={yen(totalPaid)} icon={<TrendingUp size={18} className="text-emerald-400" />} sub={`${Math.round((totalPaid / totalExpected) * 100) || 0}% tahsil edildi`} />
        <StatCard label="Gecikmiş Ödemeler" value={`${overdue} adet`} icon={<AlertCircle size={18} className="text-rose-500" />} />
        <StatCard label="Bekleyen Onaylar" value={`${pending} adet`} icon={<Clock size={18} className="text-amber-400" />} />
      </div>

      {/* Grafik */}
      <div className={`${glass} p-6`}>
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Aylık Beklenen vs Gerçekleşen Tahsilat</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#a1a1aa' }}
              formatter={(v: number) => [yen(v), '']}
            />
            <Area type="monotone" dataKey="expected" name="Beklenen" stroke="#6366f1" strokeWidth={2} fill="url(#gradExpected)" />
            <Area type="monotone" dataKey="actual"   name="Gerçekleşen" stroke="#34d399" strokeWidth={2} fill="url(#gradActual)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 border-b border-white/10 mb-5">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'payments'     && <PaymentsTab />}
        {tab === 'initialCosts' && <InitialCostsTab />}
        {tab === 'utility'      && <UtilityTab />}
      </div>
    </div>
  );
}
