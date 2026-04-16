import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X, ZoomIn, ZoomOut, Printer, Download,
  FileText, Shield, BookOpen, File
} from 'lucide-react';
import type { PropertyDocument, DocumentType } from '@/store/useDocumentStore';

const TYPE_META: Record<DocumentType, { icon: React.ReactNode; color: string; label: string }> = {
  Contract:  { icon: <FileText className="w-5 h-5" />,  color: '#6366f1', label: 'Sözleşme' },
  Insurance: { icon: <Shield className="w-5 h-5" />,    color: '#10b981', label: 'Sigorta' },
  Rules:     { icon: <BookOpen className="w-5 h-5" />,  color: '#f59e0b', label: 'Kılavuz' },
  Other:     { icon: <File className="w-5 h-5" />,      color: '#71717a', label: 'Diğer' },
};

// Mock PDF içerik satırları
const MOCK_LINES = [
  { w: '100%', h: 8 }, { w: '80%', h: 8 }, { w: '60%', h: 8 },
  { w: '0%', h: 16 },
  { w: '100%', h: 6 }, { w: '100%', h: 6 }, { w: '90%', h: 6 }, { w: '100%', h: 6 },
  { w: '85%', h: 6 }, { w: '100%', h: 6 }, { w: '70%', h: 6 },
  { w: '0%', h: 12 },
  { w: '40%', h: 7 },
  { w: '0%', h: 8 },
  { w: '100%', h: 6 }, { w: '100%', h: 6 }, { w: '95%', h: 6 }, { w: '100%', h: 6 },
  { w: '88%', h: 6 }, { w: '100%', h: 6 }, { w: '60%', h: 6 },
  { w: '0%', h: 12 },
  { w: '100%', h: 6 }, { w: '100%', h: 6 }, { w: '75%', h: 6 },
  { w: '0%', h: 20 },
  { w: '35%', h: 7 }, { w: '0%', h: 4 }, { w: '35%', h: 6 },
];

interface Props {
  doc: PropertyDocument | null;
  open: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal = ({ doc, open, onClose }: Props) => {
  const [zoom, setZoom] = useState(1);
  const meta = doc ? TYPE_META[doc.type] : null;

  const zoomIn  = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal */}
        <Dialog.Content className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-6 pb-6 px-4 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">

          {/* Toolbar */}
          <div className="w-full max-w-3xl mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            {/* Sol: Belge bilgisi */}
            <div className="flex items-center gap-3 min-w-0">
              {meta && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}20`, color: meta.color }}>
                  {meta.icon}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{doc?.name}</p>
                <p className="text-xs text-zinc-500">{doc ? formatDate(doc.uploadDate) : ''} · {doc?.size}</p>
              </div>
            </div>

            {/* Sağ: Araçlar */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all disabled:opacity-30 focus:outline-none"
                title="Uzaklaştır"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 2}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all disabled:opacity-30 focus:outline-none"
                title="Yakınlaştır"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/10 mx-1" />

              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all focus:outline-none"
                title="Yazdır"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all focus:outline-none"
                title="İndir"
              >
                <Download className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/10 mx-1" />

              <Dialog.Close asChild>
                <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all focus:outline-none" title="Kapat">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* PDF Kağıt Alanı */}
          <div className="w-full max-w-4xl flex-1 overflow-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative">
            <div className="flex justify-center p-6 h-full min-h-[600px]">
              {doc?.previewUrl ? (
                <iframe
                  src={doc.previewUrl}
                  className="w-full h-full rounded-lg bg-white"
                  title="Belge Önizleme"
                  style={{ border: 'none' }}
                />
              ) : (
                <div
                  className="bg-white rounded-lg shadow-2xl origin-top transition-transform duration-200"
                  style={{
                    width: 595,
                    minHeight: 842,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    padding: '48px 56px',
                  }}
                >
                  {/* PDF Başlık */}
                  <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${meta?.color}20`, color: meta?.color }}>
                        {meta?.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Edusama Rental</p>
                        <p className="text-xs text-gray-500">{meta?.label}</p>
                      </div>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{doc?.name?.replace('.pdf', '')}</h1>
                    <p className="text-xs text-gray-400 mt-1">Tarih: {doc ? formatDate(doc.uploadDate) : ''} · Boyut: {doc?.size}</p>
                  </div>

                  {/* Mock İçerik Satırları */}
                  <div className="space-y-2">
                    {MOCK_LINES.map((line, i) => (
                      line.w === '0%' ? (
                        <div key={i} style={{ height: line.h }} />
                      ) : (
                        <div
                          key={i}
                          className="rounded-sm bg-gray-200"
                          style={{ width: line.w, height: line.h }}
                        />
                      )
                    ))}
                  </div>

                  {/* İmza Alanı */}
                  <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
                    <div>
                      <div className="h-px bg-gray-300 mb-2" />
                      <p className="text-[10px] text-gray-400">Kiracı İmzası</p>
                    </div>
                    <div>
                      <div className="h-px bg-gray-300 mb-2" />
                      <p className="text-[10px] text-gray-400">Yönetici İmzası</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-[9px] text-gray-300">Bu belge Edusama Rental sistemi tarafından oluşturulmuştur. · {doc ? formatDate(doc.uploadDate) : ''}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
