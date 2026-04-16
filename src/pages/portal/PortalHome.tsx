import { useMemo, useState } from 'react';
import { LayoutList, Map } from 'lucide-react';
import { usePropertyStore } from '@/store/usePropertyStore';
import { PortalFilterPanel, type PortalFilters } from '@/components/portal/PortalFilterPanel';
import { PortalPropertyCard } from '@/components/portal/PortalPropertyCard';
import { PortalMap } from '@/components/portal/PortalMap';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PropertyPreview } from '@/components/admin/PropertyPreview';
import type { Property } from '@/store/usePropertyStore';

const DEFAULT_FILTERS: PortalFilters = {
  priceMin: '',
  priceMax: '',
  roomType: '',
  quakeStandard: '',
  features: [],
};

export const PortalHome = () => {
  const properties = usePropertyStore(s => s.properties);
  const [filters, setFilters] = useState<PortalFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<Property | null>(null);

  // Sadece available mülkler
  const available = useMemo(
    () => properties.filter(p => p.status === 'available'),
    [properties]
  );

  // Filtrele
  const filtered = useMemo(() => {
    return available.filter(p => {
      if (filters.priceMin && (p.price ?? 0) < Number(filters.priceMin)) return false;
      if (filters.priceMax && (p.price ?? Infinity) > Number(filters.priceMax)) return false;
      if (filters.roomType && p.roomType !== filters.roomType) return false;
      if (filters.quakeStandard && p.quakeStandard !== filters.quakeStandard) return false;
      if (filters.features.length > 0) {
        const pf = p.features ?? [];
        if (!filters.features.every(f => pf.includes(f))) return false;
      }
      return true;
    });
  }, [available, filters]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">İlanlar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} müsait mülk
          </p>
        </div>

        {/* Liste / Harita toggle */}
        <div className="flex items-center bg-muted/40 p-1 rounded-lg border border-border">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" /> Liste
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Harita
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Filtre paneli */}
        <div className="w-64 shrink-0">
          <PortalFilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>

        {/* İçerik */}
        <div className="flex-1 min-w-0">
          {view === 'list' ? (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-sm">Filtrelere uygun mülk bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => (
                  <PortalPropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
                ))}
              </div>
            )
          ) : (
            <div className="h-[calc(100vh-220px)]">
              <PortalMap properties={filtered} onSelect={setSelected} />
            </div>
          )}
        </div>
      </div>

      {/* Detay modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] w-[90vw] bg-background border-border shadow-2xl sm:rounded-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden z-[2000]">
          <div className="px-8 py-6 overflow-y-auto flex-1">
            {selected && <PropertyPreview property={selected} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
