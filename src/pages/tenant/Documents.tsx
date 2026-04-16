import { useState } from 'react';
import { FileText, Download, Eye, Calendar, Shield, BookOpen, File } from 'lucide-react';
import { useDocumentStore, type Document, type DocumentType } from '@/store/useDocumentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const TYPE_CONFIG: Record<DocumentType, { label: string; icon: React.ReactNode; color: string }> = {
  Contract:  { label: 'Sözleşmeler',  icon: <FileText className="w-4 h-4" />,  color: 'text-indigo-400' },
  Insurance: { label: 'Sigortalar',   icon: <Shield className="w-4 h-4" />,    color: 'text-emerald-400' },
  Rules:     { label: 'Kılavuzlar',   icon: <BookOpen className="w-4 h-4" />,  color: 'text-amber-400' },
  Other:     { label: 'Diğer',        icon: <File className="w-4 h-4" />,      color: 'text-zinc-400' },
};

const DownloadProgress = ({ name, onDone }: { name: string; onDone: () => void }) => {
  const [progress, setProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 600); return 100; }
        return p + 20;
      });
    }, 200);
    return () => clearInterval(interval);
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-xl border border-border bg-card shadow-2xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Download className="w-4 h-4 text-primary animate-bounce" />
        <span className="truncate">Dosya İndiriliyor...</span>
      </div>
      <p className="text-xs text-muted-foreground truncate">{name}</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground text-right">{progress}%</p>
    </div>
  );
};

const DocumentRow = ({ doc }: { doc: Document }) => {
  const [downloading, setDownloading] = useState(false);
  const cfg = TYPE_CONFIG[doc.type];

  return (
    <>
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-all duration-200 group">
        {/* PDF İkonu */}
        <div className={`w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0 ${cfg.color}`}>
          <FileText className="w-5 h-5" />
        </div>

        {/* Bilgi */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100 truncate">{doc.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" /> {formatDate(doc.uploadDate)}
            </span>
            <span className="text-xs text-muted-foreground">{doc.size}</span>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Eye className="w-3.5 h-3.5" /> Önizle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-[#2a2a2a]"
            onClick={() => setDownloading(true)}
            disabled={downloading}
          >
            <Download className="w-3.5 h-3.5" /> İndir
          </Button>
        </div>
      </div>

      {downloading && (
        <DownloadProgress name={doc.name} onDone={() => setDownloading(false)} />
      )}
    </>
  );
};

export const Documents = () => {
  const { documents } = useDocumentStore();
  
  // Oturum açan kiracının ID'si (gerçek auth gelince buraya session'dan alınacak)
  // useUserStore'daki '1' ID'li kullanıcıyı simüle ediyor
  const CURRENT_TENANT_ID = '1';
  const myDocs = documents.filter(d => d.recipientId === CURRENT_TENANT_ID);

  const grouped = (Object.keys(TYPE_CONFIG) as DocumentType[]).reduce((acc, type) => {
    const items = myDocs.filter(d => d.type === type);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {} as Partial<Record<DocumentType, Document[]>>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Belgelerim</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Kira sözleşmeleriniz, sigorta poliçeleriniz ve diğer belgeleriniz.</p>
      </div>

      {Object.entries(grouped).map(([type, docs]) => {
        const cfg = TYPE_CONFIG[type as DocumentType];
        return (
          <div key={type} className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Grup başlığı */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/10">
              <span className={cfg.color}>{cfg.icon}</span>
              <h2 className="text-sm font-semibold">{cfg.label}</h2>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{docs!.length}</Badge>
            </div>

            {/* Belgeler */}
            <div className="divide-y divide-border/50">
              {docs!.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
            </div>
          </div>
        );
      })}

      {myDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <FileText className="w-10 h-10 opacity-30" />
          <p className="text-sm">Henüz belge bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};
