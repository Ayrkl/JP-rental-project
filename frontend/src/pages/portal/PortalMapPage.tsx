import { useMemo, useState } from 'react';
import { usePropertyStore } from '@/store/usePropertyStore';
import { PortalFilterPanel, type PortalFilters } from '@/components/portal/PortalFilterPanel';
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

export const PortalMapPage = () => {
  const properties = usePropertyStore(s => s.properties);
  const [filters, setFilters] = useState<PortalFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Property | null>(null);

  const available = useMemo(
    () => properties.filter(p => p.status === 'available'),
    [properties]
  );

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
    <div className="flex gap-4 h-[calc(100vh-88px)]">
      {/* Filtre paneli */}
      <div className="w-64 shrink-0 overflow-y-auto">
        <PortalFilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {/* Tam ekran harita */}
      <div className="flex-1 min-w-0">
        <PortalMap properties={filtered} onSelect={setSelected} />
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
