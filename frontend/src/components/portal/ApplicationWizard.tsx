import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight, ChevronLeft, Upload, CheckCircle2, User, Briefcase, FileText, Phone } from 'lucide-react';
import { useApplicationStore, type ResidencyStatus } from '@/store/useApplicationStore';
import type { Property } from '@/store/usePropertyStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const STEPS = [
  { label: 'Kişisel Bilgiler', icon: User },
  { label: 'İş & Gelir',       icon: Briefcase },
  { label: 'Belgeler',          icon: FileText },
  { label: 'Acil İletişim',     icon: Phone },
];

const RESIDENCY_OPTIONS: { value: ResidencyStatus; label: string }[] = [
  { value: 'citizen',            label: 'Japon Vatandaşı' },
  { value: 'permanent_resident', label: 'Daimi İkamet (永住者)' },
  { value: 'work_visa',          label: 'Çalışma Vizesi' },
  { value: 'student_visa',       label: 'Öğrenci Vizesi' },
  { value: 'other',              label: 'Diğer' },
];

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 transition-colors';
const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5';

interface Props {
  property: Property;
  open: boolean;
  onClose: () => void;
}

export const ApplicationWizard = ({ property, open, onClose }: Props) => {
  const { submitApplication } = useApplicationStore();
  const { addNotification } = useNotificationStore();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [fullName, setFullName]           = useState('');
  const [birthDate, setBirthDate]         = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus>('work_visa');

  const [occupation, setOccupation]       = useState('');
  const [company, setCompany]             = useState('');
  const [annualIncome, setAnnualIncome]   = useState('');
  const [workYears, setWorkYears]         = useState('');

  const [idFront, setIdFront]             = useState<string | undefined>();
  const [idBack, setIdBack]               = useState<string | undefined>();
  const [incomeDocs, setIncomeDocs]       = useState<string[]>([]);
  const [dragging, setDragging]           = useState<string | null>(null);

  const [emergencyName, setEmergencyName]         = useState('');
  const [emergencyPhone, setEmergencyPhone]       = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyAddress, setEmergencyAddress]   = useState('');

  const idFrontRef  = useRef<HTMLInputElement>(null);
  const idBackRef   = useRef<HTMLInputElement>(null);
  const incomeRef   = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<string> =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleIdFront = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setIdFront(await readFile(files[0]));
  };
  const handleIdBack = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setIdBack(await readFile(files[0]));
  };
  const handleIncomeDocs = async (files: FileList | null) => {
    if (!files) return;
    const results = await Promise.all(Array.from(files).map(readFile));
    setIncomeDocs(prev => [...prev, ...results].slice(0, 3));
  };

  const canNext = () => {
    if (step === 0) return fullName && birthDate && currentAddress;
    if (step === 1) return occupation && company && annualIncome && workYears;
    if (step === 2) return true; // belgeler opsiyonel
    if (step === 3) return emergencyName && emergencyPhone && emergencyRelation;
    return false;
  };

  const handleSubmit = () => {
    submitApplication({
      propertyId: property.id,
      propertyAddress: property.address,
      propertyPrice: property.price,
      submittedAt: new Date().toISOString(),
      fullName, birthDate, currentAddress, residencyStatus,
      occupation, company,
      annualIncome: Number(annualIncome),
      workYears: Number(workYears),
      idFront, idBack, incomeDocs,
      emergencyName, emergencyPhone, emergencyRelation, emergencyAddress,
    });
    addNotification({
      title: 'Başvurunuz Alındı',
      message: `${property.address} için başvurunuz incelemeye alındı.`,
      type: 'success',
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(0); setSubmitted(false);
    onClose();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95vw] max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden focus:outline-none">

          {/* Header */}
          <div className="px-8 pt-7 pb-5 border-b border-white/5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <Dialog.Title className="text-xl font-bold text-zinc-100">Kiralama Başvurusu</Dialog.Title>
                <p className="text-xs text-zinc-500 mt-1 truncate max-w-[400px]">{property.address}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-zinc-600 hover:text-zinc-300 transition-colors mt-1">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between mt-4">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      done ? 'bg-indigo-500 text-white' :
                      active ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-400' :
                      'bg-white/5 border border-white/10 text-zinc-600'
                    }`}>
                      {done ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${active ? 'text-indigo-400' : done ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[55vh] overflow-y-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">Başvurunuz Alındı!</h3>
                <p className="text-sm text-zinc-400 max-w-sm">
                  Başvurunuz incelemeye alındı. Sonuç bildirim olarak iletilecektir.
                </p>
              </div>
            ) : (
              <>
                {/* Aşama 1 */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Ad Soyad *</label>
                        <input value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} placeholder="Tam adınız" />
                      </div>
                      <div>
                        <label className={labelCls}>Doğum Tarihi *</label>
                        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputCls} style={{ colorScheme: 'dark' }} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Mevcut Adres *</label>
                      <input value={currentAddress} onChange={e => setCurrentAddress(e.target.value)} className={inputCls} placeholder="Şu anki ikamet adresiniz" />
                    </div>
                    <div>
                      <label className={labelCls}>Japonya'daki Oturum Statüsü *</label>
                      <select value={residencyStatus} onChange={e => setResidencyStatus(e.target.value as ResidencyStatus)}
                        className={inputCls} style={{ colorScheme: 'dark' }}>
                        {RESIDENCY_OPTIONS.map(o => (
                          <option key={o.value} value={o.value} className="bg-[#1a1a1a] text-zinc-100">{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Aşama 2 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Meslek *</label>
                        <input value={occupation} onChange={e => setOccupation(e.target.value)} className={inputCls} placeholder="Yazılım Mühendisi..." />
                      </div>
                      <div>
                        <label className={labelCls}>Şirket Adı *</label>
                        <input value={company} onChange={e => setCompany(e.target.value)} className={inputCls} placeholder="Şirket adı" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Yıllık Gelir (¥) *</label>
                        <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} className={inputCls} placeholder="5000000" />
                      </div>
                      <div>
                        <label className={labelCls}>Çalışma Süresi (Yıl) *</label>
                        <input type="number" value={workYears} onChange={e => setWorkYears(e.target.value)} className={inputCls} placeholder="3" />
                      </div>
                    </div>
                    {annualIncome && property.price && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="text-xs text-zinc-400">Gelir/Kira Oranı</div>
                        <div className="text-sm font-bold text-indigo-400">
                          {(Number(annualIncome) / (property.price * 12)).toFixed(1)}x
                        </div>
                        <div className="text-xs text-zinc-500">(önerilen: min 3x)</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Aşama 3 */}
                {step === 2 && (
                  <div className="space-y-5">
                    <p className="text-xs text-zinc-500">Belgeler şifreli olarak tarayıcınızda saklanır, sunucuya gönderilmez.</p>

                    {/* ID Ön Yüz */}
                    <div>
                      <label className={labelCls}>Kimlik / Pasaport — Ön Yüz</label>
                      <div
                        onDragOver={e => { e.preventDefault(); setDragging('front'); }}
                        onDragLeave={() => setDragging(null)}
                        onDrop={e => { e.preventDefault(); setDragging(null); handleIdFront(e.dataTransfer.files); }}
                        onClick={() => idFrontRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging === 'front' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
                      >
                        <input ref={idFrontRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleIdFront(e.target.files)} />
                        {idFront ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                            <CheckCircle2 size={16} /> Yüklendi
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-zinc-500">
                            <Upload size={20} />
                            <span className="text-xs">Sürükle & Bırak veya tıkla</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ID Arka Yüz */}
                    <div>
                      <label className={labelCls}>Kimlik / 在留カード — Arka Yüz</label>
                      <div
                        onDragOver={e => { e.preventDefault(); setDragging('back'); }}
                        onDragLeave={() => setDragging(null)}
                        onDrop={e => { e.preventDefault(); setDragging(null); handleIdBack(e.dataTransfer.files); }}
                        onClick={() => idBackRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging === 'back' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
                      >
                        <input ref={idBackRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleIdBack(e.target.files)} />
                        {idBack ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                            <CheckCircle2 size={16} /> Yüklendi
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-zinc-500">
                            <Upload size={20} />
                            <span className="text-xs">Sürükle & Bırak veya tıkla</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gelir Belgesi */}
                    <div>
                      <label className={labelCls}>Gelir Belgesi (maks. 3 dosya)</label>
                      <div
                        onDragOver={e => { e.preventDefault(); setDragging('income'); }}
                        onDragLeave={() => setDragging(null)}
                        onDrop={e => { e.preventDefault(); setDragging(null); handleIncomeDocs(e.dataTransfer.files); }}
                        onClick={() => incomeRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging === 'income' ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
                      >
                        <input ref={incomeRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={e => handleIncomeDocs(e.target.files)} />
                        {incomeDocs.length > 0 ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                            <CheckCircle2 size={16} /> {incomeDocs.length} dosya yüklendi
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-zinc-500">
                            <Upload size={20} />
                            <span className="text-xs">Maaş bordrosu veya vergi belgesi</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Aşama 4 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-500">Japonya'da ikamet eden bir acil iletişim kişisi bilgilerini girin.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Ad Soyad *</label>
                        <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} className={inputCls} placeholder="Acil kişi adı" />
                      </div>
                      <div>
                        <label className={labelCls}>Telefon *</label>
                        <input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} className={inputCls} placeholder="+81 90 xxxx xxxx" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Yakınlık *</label>
                        <input value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} className={inputCls} placeholder="Eş, Anne, Arkadaş..." />
                      </div>
                      <div>
                        <label className={labelCls}>Adres</label>
                        <input value={emergencyAddress} onChange={e => setEmergencyAddress(e.target.value)} className={inputCls} placeholder="Japonya'daki adresi" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} /> Geri
              </button>

              <span className="text-xs text-zinc-600">{step + 1} / {STEPS.length}</span>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext()}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  İleri <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canNext()}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={15} /> Başvuruyu Gönder
                </button>
              )}
            </div>
          )}

          {submitted && (
            <div className="px-8 py-5 border-t border-white/5 flex justify-center">
              <button onClick={handleClose} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all">
                Kapat
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
