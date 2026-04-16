import { useState } from 'react';
import { FileText, Trash2, Calendar, Send, CheckCircle2, Shield, BookOpen, File } from 'lucide-react';
import { useDocumentStore, DOCUMENT_TEMPLATES, type DocumentType } from '@/store/useDocumentStore';
import { useUserStore } from '@/store/useUserStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

// ── Tip Konfigürasyonu ──────────────────────────────────────────────────────
const TYPE_LABELS: Record<DocumentType, string> = {
  Contract:  'Sözleşme',
  Insurance: 'Sigorta',
  Rules:     'Kılavuz',
  Other:     'Diğer',
};

const TYPE_COLORS: Record<DocumentType, string> = {
  Contract:  'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Insurance: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Rules:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Other:     'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

const TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  Contract:  <FileText className="w-4 h-4" />,
  Insurance: <Shield className="w-4 h-4" />,
  Rules:     <BookOpen className="w-4 h-4" />,
  Other:     <File className="w-4 h-4" />,
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ── Ana Bileşen ──────────────────────────────────────────────────────────────
export const DocumentManager = () => {
  const { documents, sendDocument, deleteDocument } = useDocumentStore();
  const { users } = useUserStore();
  const { t: tRaw } = useTranslation('users');
  const t = tRaw as unknown as (key: string, opts?: Record<string, unknown>) => string;

  const TYPE_LABELS: Record<DocumentType, string> = {
    Contract:  t('docTypeContract'),
    Insurance: t('docTypeInsurance'),
    Rules:     t('docTypeRules'),
    Other:     t('docTypeOther'),
  };

  const [recipientId, setRecipientId]   = useState('');
  const [selectedTpl, setSelectedTpl]   = useState('');
  const [justSent, setJustSent]         = useState(false);

  const handleSend = () => {
    if (!recipientId || !selectedTpl) return;
    sendDocument(selectedTpl, recipientId);
    setSelectedTpl('');
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2000);
  };

  const chosenTemplate = DOCUMENT_TEMPLATES.find(t => t.id === selectedTpl);

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('docTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t('docSubtitle')}
        </p>
      </div>

      {/* ── Gönderim Formu ── */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-zinc-200">{t('docUploadSection')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Alıcı Seç */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Alıcı Kullanıcı <span className="text-rose-400">*</span>
            </Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger className="h-10 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue placeholder="Kullanıcı seçin..." />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4}>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Belge Şablonu Seç */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Belge <span className="text-rose-400">*</span>
            </Label>
            <Select value={selectedTpl} onValueChange={setSelectedTpl}>
              <SelectTrigger className="h-10 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue placeholder="Belge seçin..." />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4}>
                {DOCUMENT_TEMPLATES.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <span>{t.name}</span>
                      <span className="text-xs text-muted-foreground">({t.size})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Seçilen Belge Önizleme */}
        {chosenTemplate && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/10 border border-border/60">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[chosenTemplate.type]}`}>
              {TYPE_ICONS[chosenTemplate.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100">{chosenTemplate.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{chosenTemplate.description} · {chosenTemplate.size}</p>
            </div>
            <Badge className={`text-[10px] px-2 py-0.5 border shrink-0 ${TYPE_COLORS[chosenTemplate.type]}`}>
              {TYPE_LABELS[chosenTemplate.type]}
            </Badge>
          </div>
        )}

        {/* Gönder Butonu */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {!recipientId && !selectedTpl ? 'Kullanıcı ve belge seçin.' :
             !recipientId ? 'Alıcı kullanıcı seçilmedi.' :
             !selectedTpl ? 'Gönderilecek belge seçilmedi.' :
             `"${users.find(u => u.id === recipientId)?.name}" hesabına gönderilecek.`}
          </p>
          <Button
            onClick={handleSend}
            disabled={!recipientId || !selectedTpl}
            className="gap-2 min-w-[140px]"
          >
            {justSent
              ? <><CheckCircle2 className="w-4 h-4" /> Gönderildi!</>
              : <><Send className="w-4 h-4" /> Kiracıya Gönder</>
            }
          </Button>
        </div>
      </div>

      {/* ── Gönderim Geçmişi ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">{t('docAllDocs')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('docSubtitle')}</p>
          </div>
          <Badge variant="secondary" className="text-xs">{documents.length} {t('docCount')}</Badge>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <FileText className="w-8 h-8 opacity-30" />
            <p className="text-sm">{t('docEmpty')}</p>
            <p className="text-xs opacity-60">Yukarıdan belge seçip gönderin.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {documents.map(doc => {
              const recipient = users.find(u => u.id === doc.recipientId);
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-all group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[doc.type]}`}>
                    {TYPE_ICONS[doc.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{formatDate(doc.uploadDate)}
                      </span>
                      <span>{doc.size}</span>
                      {recipient && (
                        <span className="text-indigo-400 font-medium">
                          → {recipient.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge className={`text-[10px] px-2 py-0.5 border shrink-0 ${TYPE_COLORS[doc.type]}`}>
                    {TYPE_LABELS[doc.type]}
                  </Badge>

                  <button
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Geri Al"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
