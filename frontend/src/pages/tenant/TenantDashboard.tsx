import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { CreditCard, Clock, TrendingUp, Bell, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

// ── Mock Veri ──────────────────────────────────────────────────────────────
const TREND_DATA = [
  { ay: 'Oca', kira: 120000, faturalar: 18400 },
  { ay: 'Şub', kira: 120000, faturalar: 21200 },
  { ay: 'Mar', kira: 120000, faturalar: 16800 },
  { ay: 'Nis', kira: 120000, faturalar: 19500 },
  { ay: 'May', kira: 120000, faturalar: 22100 },
  { ay: 'Haz', kira: 120000, faturalar: 17300 },
];

const PIE_DATA = [
  { name: 'Kira',     value: 120000, color: '#6366f1' },
  { name: 'Elektrik', value: 8200,   color: '#10b981' },
  { name: 'Su',       value: 4100,   color: '#3b82f6' },
  { name: 'Gaz',      value: 5000,   color: '#f59e0b' },
];

type PaymentStatus = 'paid' | 'pending' | 'overdue';

const PAYMENTS: { period: string; item: string; amount: number; status: PaymentStatus }[] = [
  { period: 'Haz 2025', item: 'Kira',     amount: 120000, status: 'pending' },
  { period: 'Haz 2025', item: 'Elektrik', amount: 8200,   status: 'pending' },
  { period: 'May 2025', item: 'Kira',     amount: 120000, status: 'paid'    },
  { period: 'May 2025', item: 'Su',       amount: 4100,   status: 'paid'    },
  { period: 'May 2025', item: 'Gaz',      amount: 5000,   status: 'paid'    },
  { period: 'Nis 2025', item: 'Kira',     amount: 120000, status: 'paid'    },
  { period: 'Nis 2025', item: 'Elektrik', amount: 9500,   status: 'overdue' },
];

const TOTAL_PAID = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
const CURRENT_BALANCE = PAYMENTS.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);

const STATUS_CONFIG_CLASSES: Record<PaymentStatus, string> = {
  paid:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border px-4 py-3 text-xs space-y-1.5" style={{ background: '#1a1a1a' }}>
      <p className="font-semibold text-zinc-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ¥{p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ── Bileşen ────────────────────────────────────────────────────────────────
export const TenantDashboard = () => {
  const { t: tRaw } = useTranslation('navigation');
  const t = tRaw as unknown as (key: string) => string;

  const STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
    paid:    { label: t('paid'),    className: STATUS_CONFIG_CLASSES.paid },
    pending: { label: t('pending'), className: STATUS_CONFIG_CLASSES.pending },
    overdue: { label: t('overdue'), className: STATUS_CONFIG_CLASSES.overdue },
  };

  const statCards = [
    {
      icon: CreditCard,
      label: t('currentBalance'),
      value: `¥${CURRENT_BALANCE.toLocaleString()}`,
      sub: t('pending'),
      valueClass: CURRENT_BALANCE > 0 ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      icon: Clock,
      label: t('nextPayment'),
      value: '¥128,200',
      sub: '1 Temmuz 2025',
      valueClass: 'text-amber-400',
    },
    {
      icon: TrendingUp,
      label: t('totalPaid'),
      value: `¥${TOTAL_PAID.toLocaleString()}`,
      sub: t('paid'),
      valueClass: 'text-emerald-400',
    },
    {
      icon: Bell,
      label: t('activeNotices'),
      value: '3',
      sub: t('notices'),
      valueClass: 'text-indigo-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('financialSummary')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Haziran 2025 · {t('tenantHome')}</p>
      </div>

      {/* Stat Kartları */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, sub, valueClass }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all duration-200 space-y-3"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Grafik Satırı */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Trend Grafiği — 2/3 genişlik */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">{t('paymentTrend')}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradKira" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradFatura" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="ay" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `¥${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="kira"     name={t('rent')}  stroke="#6366f1" strokeWidth={2} fill="url(#gradKira)"   />
              <Area type="monotone" dataKey="faturalar" name={t('bills')} stroke="#10b981" strokeWidth={2} fill="url(#gradFatura)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" />{t('rent')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />{t('bills')}</span>
          </div>
        </div>

        {/* Pie Chart — 1/3 genişlik */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold">{t('expenseBreakdown')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [`¥${v.toLocaleString()}`, '']}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </span>
                <span className="font-medium">¥{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ödeme Tablosu */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">{t('recentPayments')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">{t('period')}</th>
                <th className="text-left px-5 py-3 font-medium">{t('item')}</th>
                <th className="text-right px-5 py-3 font-medium">{t('amount')}</th>
                <th className="text-center px-5 py-3 font-medium">{t('status')}</th>
                <th className="text-center px-5 py-3 font-medium">{t('document')}</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p, i) => {
                const cfg = STATUS_CONFIG[p.status];
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground">{p.period}</td>
                    <td className="px-5 py-3 font-medium">{p.item}</td>
                    <td className="px-5 py-3 text-right font-mono font-semibold">¥{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <Badge className={`text-[10px] px-2 py-0.5 border ${cfg.className}`}>
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {p.status === 'paid' ? (
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                          <FileText className="w-3.5 h-3.5" />
                          {t('receipt')}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
