import { Search, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const PortalHome = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">İlan Portalı</h1>
        <p className="text-sm text-muted-foreground mt-1">Geliştirme Aşamasında</p>
      </div>

      {/* Arama çubuğu placeholder */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/10 px-4 py-3 opacity-50 cursor-not-allowed select-none">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">Konum, fiyat veya oda tipi ile ara...</span>
      </div>

      {/* Boş ilan kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-48 flex items-center justify-center border-dashed">
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">İlan {i}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
        <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Bu portal backend entegrasyonu tamamlandığında aktif olacak.
        </p>
      </div>
    </div>
  );
};
