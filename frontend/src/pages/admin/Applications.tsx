import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  CheckCircle2, XCircle, FileQuestion, X, Eye,
  TrendingUp, Clock, User, Briefcase, Phone, FileText
} from 'lucide-react';
import {
  useApplicationStore, calcTrustScore,
  type Application, type ApplicationStatus
} from '@/store/useApplicationStore';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; cls: string }> = {
  draft:          { label: 'Taslak',       cls: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  submitted:      { label: 'İnceleniyor',  cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  pre_approved:   { label: 'Ön Onay',      cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  docs_requested: { label: 'Belge Bekleniyor', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  rejected:       { label: 'Reddedildi',   cls: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
};

const TRUST_COLOR = (score: number) => {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-500';
};

// ── Detay Drawer ──────────────────────────────────────────────────────────

function ApplicationDrawer({ app, onClose }: { app: Application; onClose: () => void }) {
  const { updateStatus } = useApplicationStore();
  const { updateProperty } = usePropertyStore();
  const { addNotification } = useNotificationStore();
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const trustScore = calcTrustScore(app.annualIncome, app.propertyPrice ?? 0);

  const handleDecision = (status: ApplicationStatus) => {
    updateStatus(app.id, status, note || undefined);

    if (status === 'pre_approved' && app.propertyId) {
      try { updateProperty(app.propertyId, { status: 'leased' } as any); } catch {}
    }

    addNotification({
      title: status === 'pre_approved' ? 'Başvuru Onaylandı' : status === 'rejected' ? 'Başvuru Reddedildi' : 'Ek Belge İstendi',
      message: `${app.fullName} — ${app.propertyAddress ?? ''}`,
      type: status === 'pre_approved' ? 'success' : status === 'rejected' ? 'warning' : 'info',
    });
    onClose();
  };

  const docs = [
    { label: 'Kimlik Ön', src: app.idFront },
    { label: 'Kimlik Arka', src: app.idBack },
    ...(app.incomeDocs ?? []).map((src, i) => ({ label: `Gelir Belgesi ${i + 1}`, src })),
  ].filter(d => d.src);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0d0d0d] border-l border-white/10 z-[9999] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">{app.fullName}</h2>
            <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[300px]">{app.propertyAddress}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Güven Skoru */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-center">
              <p className={`text-3xl font-black ${TRUST_COLOR(trustScore)}`}>{trustScore}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Güven Skoru</p>
            </div>
            <div className="flex-1 space-y-1 text-xs text-zinc-400">
              <div className="flex justify-between"><span>Yıllık Gelir</span><span className="text-zinc-200">¥{app.annualIncome.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Aylık Kira</span><span className="text-zinc-200">¥{(app.propertyPrice ?? 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Oran</span><span className="text-zinc-200">{app.propertyPrice ? (app.annualIncome / (app.propertyPrice * 12)).toFixed(1) : '—'}x</span></div>
            </div>
          </div>

          {/* Kişisel */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><User size={12} /> Kişisel Bilgiler</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Doğum Tarihi', app.birthDate],
                ['Oturum', app.residencyStatus],
                ['Adres', app.currentAddress],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg px-3 py-2">
                  <p className="text-zinc-500">{k}</p>
                  <p className="text-zinc-200 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* İş */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={12} /> İş & Gelir</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Meslek', app.occupation],
                ['Şirket', app.company],
                ['Çalışma Süresi', `${app.workYears} yıl`],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg px-3 py-2">
                  <p className="text-zinc-500">{k}</p>
                  <p className="text-zinc-200 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Acil İletişim */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Phone size={12} /> Acil İletişim</h3>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-xs space-y-1">
              <p className="text-zinc-200 font-medium">{app.emergencyName} <span className="text-zinc-500">({app.emergencyRelation})</span></p>
              <p className="text-zinc-400">{app.emergencyPhone}</p>
              {app.emergencyAddress && <p className="text-zinc-500">{app.emergencyAddress}</p>}
            </div>
          </section>

          {/* Belgeler */}
          {docs.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><FileText size={12} /> Belgeler</h3>
              <div className="grid grid-cols-3 gap-2">
                {docs.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewImg(d.src!)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all group"
                  >
                    <img src={d.src} alt={d.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-black/70 text-zinc-300 py-0.5">{d.label}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Not */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Admin Notu</h3>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="İsteğe bağlı not..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </section>
        </div>

        {/* Karar Butonları */}
        {app.status !== 'pre_approved' && app.status !== 'rejected' && (
          <div className="px-6 py-4 border-t border-white/5 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDecision('pre_approved')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all"
            >
              <CheckCircle2 size={14} /> Ön Onay
            </button>
            <button
              onClick={() => handleDecision('docs_requested')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 transition-all"
            >
              <FileQuestion size={14} /> Belge İste
            </button>
            <button
              onClick={() => handleDecision('rejected')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
            >
              <XCircle size={14} /> Reddet
            </button>
          </div>
        )}
      </div>

      {/* Tam ekran belge önizleme */}
      {previewImg && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Belge" className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain" />
          <button className="absolute top-6 right-6 text-zinc-400 hover:text-white" onClick={() => setPreviewImg(null)}>
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
}

// ── Ana Sayfa ──────────────────────────────────────────────────────────────

export const Applications = () => {
  const { applications } = useApplicationStore();
  const [selected, setSelected] = useState<Application | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const stats = {
    total:       applications.length,
    submitted:   applications.filter(a => a.status === 'submitted').length,
    preApproved: applications.filter(a => a.status === 'pre_approved').length,
    rejected:    applications.filter(a => a.status === 'rejected').length,
  };

  const FILTERS: { key: ApplicationStatus | 'all'; label: string }[] = [
    { key: 'all',          label: 'Tümü' },
    { key: 'submitted',    label: 'İnceleniyor' },
    { key: 'pre_approved', label: 'Ön Onay' },
    { key: 'docs_requested', label: 'Belge Bekleniyor' },
    { key: 'rejected',     label: 'Reddedildi' },
  ];

  return (
    <div className="space-y-6 text-zinc-100">
      <div>
        <h1 className="text-2xl font-bold">Başvuru Yönetimi</h1>
        <p className="text-sm text-zinc-500 mt-1">Kiralama başvurularını inceleyin ve karara bağlayın.</p>
      </div>

      {/* Stat kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Başvuru', value: stats.total,       icon: <FileText size={18} />,      color: 'text-zinc-300' },
          { label: 'İnceleniyor',    value: stats.submitted,   icon: <Clock size={18} />,          color: 'text-blue-400' },
          { label: 'Ön Onay',        value: stats.preApproved, icon: <CheckCircle2 size={18} />,   color: 'text-emerald-400' },
          { label: 'Reddedildi',     value: stats.rejected,    icon: <XCircle size={18} />,        color: 'text-rose-500' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">{s.label}</span>
              <span className={s.color}>{s.icon}</span>
            </div>
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500 text-xs">
              <th className="text-left px-5 py-3">Başvuran</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">Mülk</th>
              <th className="text-right px-5 py-3 hidden lg:table-cell">Yıllık Gelir</th>
              <th className="text-center px-5 py-3 hidden lg:table-cell">Güven Skoru</th>
              <th className="text-left px-5 py-3">Durum</th>
              <th className="text-right px-5 py-3">İncele</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-zinc-500 text-sm">Başvuru bulunamadı.</td></tr>
            )}
            {filtered.map(app => {
              const trust = calcTrustScore(app.annualIncome, app.propertyPrice ?? 0);
              const sc = STATUS_CONFIG[app.status];
              return (
                <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-100">{app.fullName}</p>
                    <p className="text-xs text-zinc-500">{app.submittedAt?.slice(0, 10)}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-zinc-300 text-xs truncate max-w-[200px]">{app.propertyAddress ?? '—'}</p>
                    {app.propertyPrice && <p className="text-xs text-zinc-500">¥{app.propertyPrice.toLocaleString()}/ay</p>}
                  </td>
                  <td className="px-5 py-3 text-right hidden lg:table-cell">
                    <span className="text-zinc-200 font-mono text-xs">¥{app.annualIncome.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp size={12} className={TRUST_COLOR(trust)} />
                      <span className={`font-bold text-sm ${TRUST_COLOR(trust)}`}>{trust}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${sc.cls}`}>{sc.label}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelected(app)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-xs hover:text-zinc-200 hover:bg-white/10 transition-all ml-auto"
                    >
                      <Eye size={13} /> İncele
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selected && <ApplicationDrawer app={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
