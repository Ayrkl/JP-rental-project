import { useState, useRef } from 'react';
import { 
  FileText, Trash2, Calendar, Send, CheckCircle2, Shield, 
  BookOpen, File, UploadCloud, Eye, X, Plus
} from 'lucide-react';
import { useDocumentStore, DOCUMENT_TEMPLATES, type DocumentType, type PropertyDocument } from '@/store/useDocumentStore';
import { useUserStore } from '@/store/useUserStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { DocumentPreviewModal } from '@/components/shared/DocumentPreviewModal';

// ── Tip Konfigürasyonu ──────────────────────────────────────────────────────
const TYPE_COLORS: Record<DocumentType, string> = {
  Contract: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Insurance: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Rules: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Other: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

const TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  Contract: <FileText className="w-4 h-4" />,
  Insurance: <Shield className="w-4 h-4" />,
  Rules: <BookOpen className="w-4 h-4" />,
  Other: <File className="w-4 h-4" />,
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const DocumentManager = () => {
  const { documents, sendDocument, sendCustomDocument, deleteDocument } = useDocumentStore();
  const { users } = useUserStore();
  const { t: tRaw } = useTranslation('users');
  const t = tRaw as unknown as (key: string, opts?: Record<string, unknown>) => string;

  const TYPE_LABELS: Record<DocumentType, string> = {
    Contract: t('docTypeContract'),
    Insurance: t('docTypeInsurance'),
    Rules: t('docTypeRules'),
    Other: t('docTypeOther'),
  };

  // State
  const [activeTab, setActiveTab] = useState<'template' | 'upload'>('template');
  const [recipientId, setRecipientId] = useState('');
  const [selectedTpl, setSelectedTpl] = useState('');
  const [justSent, setJustSent] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PropertyDocument | null>(null);
  
  // Arşiv/Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<DocumentType>('Other');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!recipientId) return;

    if (activeTab === 'template' && selectedTpl) {
      sendDocument(selectedTpl, recipientId);
      setSelectedTpl('');
    } else if (activeTab === 'upload' && uploadFile) {
      sendCustomDocument({
        name: uploadFile.name,
        size: (uploadFile.size / 1024 / 1024).toFixed(1) + ' MB',
        type: uploadType
      }, recipientId);
      setUploadFile(null);
    }

    setJustSent(true);
    setTimeout(() => setJustSent(false), 2000);
  };

  const chosenTemplate = DOCUMENT_TEMPLATES.find(t => t.id === selectedTpl);

  return (
    <div className="space-y-6 pb-20">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('docTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t('docSubtitle')}
        </p>
      </div>

      {/* ── Gönderim Alanı ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Tab Seçimi */}
        <div className="flex border-b border-border p-1 bg-muted/20">
          <button
            onClick={() => setActiveTab('template')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'template' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" /> Şablonlardan Seç
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'upload' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Özel Dosya Yükle
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Alıcı Seç (Her iki tab için ortak) */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Alıcı Kullanıcı <span className="text-rose-400">*</span>
            </Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger className="h-14 w-full bg-[#111] border-[#2a2a2a] text-base px-6">
                <SelectValue placeholder="Kullanıcı seçin..." />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4} className="w-[var(--radix-select-trigger-width)]">
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

          {activeTab === 'template' ? (
            /* ── Şablon Seçimi ── */
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Belge Şablonu <span className="text-rose-400">*</span>
                </Label>
                <Select value={selectedTpl} onValueChange={setSelectedTpl}>
                  <SelectTrigger className="h-14 w-full bg-[#111] border-[#2a2a2a] text-base px-6">
                    <SelectValue placeholder="Şablon seçin..." />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4} className="w-[var(--radix-select-trigger-width)]">
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

              {chosenTemplate && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/10 border border-border/60">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[chosenTemplate.type]}`}>
                    {TYPE_ICONS[chosenTemplate.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100">{chosenTemplate.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{chosenTemplate.description} · {chosenTemplate.size}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Özel Dosya Yükleme ── */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Belge Tipi</Label>
                  <Select value={uploadType} onValueChange={(v) => setUploadType(v as DocumentType)}>
                    <SelectTrigger className="h-12 bg-[#111] border-[#2a2a2a]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                   <Label className="text-xs text-muted-foreground">Dosya Seçimi</Label>
                   <Button 
                    variant="outline" 
                    className="w-full h-12 border-dashed border-[#2a2a2a] hover:border-primary/50 gap-2"
                    onClick={() => fileRef.current?.click()}
                   >
                     {uploadFile ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                     {uploadFile ? uploadFile.name : 'Dosya Seçin'}
                   </Button>
                   <input 
                    type="file" 
                    ref={fileRef} 
                    className="hidden" 
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx"
                   />
                </div>
              </div>
            </div>
          )}

          {/* Gönder Butonu */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              {!recipientId ? 'Alıcı kullanıcı seçilmedi.' :
               (activeTab === 'template' && !selectedTpl) ? 'Gönderilecek şablon seçilmedi.' :
               (activeTab === 'upload' && !uploadFile) ? 'Dosya yüklenmedi.' :
               `"${users.find(u => u.id === recipientId)?.name}" hesabına gönderilecek.`}
            </p>
            <Button
              onClick={handleSend}
              disabled={!recipientId || (activeTab === 'template' ? !selectedTpl : !uploadFile)}
              className="gap-2 min-w-[140px]"
            >
              {justSent
                ? <><CheckCircle2 className="w-4 h-4" /> Gönderildi!</>
                : <><Send className="w-4 h-4" /> Belgeyi Gönder</>
              }
            </Button>
          </div>
        </div>
      </div>

      {/* ── Gönderim Geçmişi ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">{t('docAllDocs')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Sistem üzerinden paylaşılan tüm belgeler</p>
          </div>
          <Badge variant="secondary" className="text-xs">{documents.length} {t('docCount')}</Badge>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <FileText className="w-8 h-8 opacity-30" />
            <p className="text-sm">{t('docEmpty')}</p>
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

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="w-3.5 h-3.5" /> Önizle
                    </Button>
                    <button
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Geri Al"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Önizleme Modalı */}
      <DocumentPreviewModal 
        doc={previewDoc}
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};
