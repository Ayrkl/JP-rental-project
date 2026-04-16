import { Search, Info } from 'lucide-react';

const placeholderListings = [1, 2, 3];

export const PortalHome = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-amber-100">İlan Portalı</h1>
        <p className="text-amber-700 text-sm mt-1">Geliştirme Aşamasında</p>
      </div>

      {/* Arama çubuğu placeholder */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3 opacity-50 cursor-not-allowed">
        <Search className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm text-amber-600">Konum, fiyat veya oda tipi ile ara...</span>
      </div>

      {/* Boş ilan kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {placeholderListings.map((i) => (
          <div
            key={i}
            className="rounded-xl border border-amber-900/40 bg-amber-950/10 h-48 flex items-center justify-center"
          >
            <span className="text-amber-800 text-sm">İlan {i}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-400">
          Bu portal backend entegrasyonu tamamlandığında aktif olacak.
        </p>
      </div>
    </div>
  );
};
