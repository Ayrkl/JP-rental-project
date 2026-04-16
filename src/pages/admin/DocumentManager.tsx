import { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, Calendar, Download } from 'lucide-react';
import { useDocumentStore, type DocumentType } from '@/store/useDocumentStore';
import { usePropertyStore } from '@/store/usePropertyStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const TYPE_LABELS: Record<DocumentType, string> = {
  Contract: 'Sözleşme',
  Insurance: 'Sigorta',
  Rules: 'Kılavuz',
  Other: 'Diğer',
};

const TYPE_COLORS: Record<DocumentType, string> = {
  Contract:  'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Insurance: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Rules:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Other:     'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

export const DocumentManager = () => {
  const { documents, addDocument, deleteDocument } = useDocumentStore();
  const { properties } = usePropertyStore();

  const [dragging, setDragging] = useState(false);
  const [docType, setDocType] = useState<DocumentType>('Contract');
  const [propertyId, setPropertyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('tenant1');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1) + ' MB';
      addDocument({
        name: file.name,
        type: docType,
        uploadDate: new Date().toISOString().split('T')[0],
        size: sizeMB,
        propertyId: propertyId || undefined,
        userId: userId || undefined,
      });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Döküman Yönetimi</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Belgeleri yükleyin, mülk ve kiracılarla ilişkilendirin.</p>
      </div>

      {/* Yükleme Alanı */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold">Belge Yükle</h2>

        {/* Atama seçiciler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Belge Tipi</Label>
            <Select value={docType} onValueChange={v => setDocType(v as DocumentType)}>
              <SelectTrigger className="h-9 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABELS) as DocumentType[]).map(t => (
                  <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Mülk (Opsiyonel)</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="h-9 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue placeholder="Mülk seçin..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Seçilmedi</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.address.slice(0, 40)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Kullanıcı ID</Label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="tenant1"
              className="w-full h-9 rounded-md border border-[#2a2a2a] bg-[#111] px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        {/* Drag & Drop */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragging ? 'border-primary bg-primary/5' : 'border-[#2a2a2a] hover:border-zinc-500 bg-muted/5'
          }`}
        >
          <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFiles(e.target.files)} />
          <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm font-medium">Dosyaları buraya sürükleyin veya tıklayın</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX — Maks. 20 MB</p>
        </div>
      </div>

      {/* Belge Listesi */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tüm Belgeler</h2>
          <Badge variant="secondary" className="text-xs">{documents.length} belge</Badge>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <FileText className="w-8 h-8 opacity-30" />
            <p className="text-sm">Henüz belge yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-all group">
                <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(doc.uploadDate)}</span>
                    <span>{doc.size}</span>
                    {doc.userId && <span>Kullanıcı: {doc.userId}</span>}
                  </div>
                </div>

                <Badge className={`text-[10px] px-2 py-0.5 border shrink-0 ${TYPE_COLORS[doc.type]}`}>
                  {TYPE_LABELS[doc.type]}
                </Badge>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#1e1e1e] transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
