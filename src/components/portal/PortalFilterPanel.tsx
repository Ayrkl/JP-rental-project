import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type PortalFilters = {
  priceMin: string;
  priceMax: string;
  roomType: string;
  quakeStandard: string;
  features: string[];
};

const ROOM_TYPES = ['1K', '1LDK', '2LDK', '3LDK', '4LDK'];
const QUAKE_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'old', label: 'Eski Standart' },
  { value: 'new', label: 'Yeni Standart' },
  { value: 'grade2', label: 'Grade 2' },
  { value: 'grade3', label: 'Grade 3' },
];
const FEATURE_OPTIONS = [
  { id: 'internet', label: 'Fiber İnternet' },
  { id: 'elevator', label: 'Asansör' },
  { id: 'parking', label: 'Otopark' },
  { id: 'pets', label: 'Evcil Hayvan' },
  { id: 'autolock', label: 'Otomatik Kilit' },
  { id: 'balcony', label: 'Balkon' },
];

interface Props {
  filters: PortalFilters;
  onChange: (filters: PortalFilters) => void;
  onReset: () => void;
}

export const PortalFilterPanel = ({ filters, onChange, onReset }: Props) => {
  const set = (partial: Partial<PortalFilters>) => onChange({ ...filters, ...partial });

  const toggleFeature = (id: string) => {
    const next = filters.features.includes(id)
      ? filters.features.filter(f => f !== id)
      : [...filters.features, id];
    set({ features: next });
  };

  const hasActive =
    filters.priceMin || filters.priceMax || filters.roomType ||
    filters.quakeStandard || filters.features.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filtreler</h3>
        {hasActive && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={onReset}>
            <X className="w-3 h-3" /> Temizle
          </Button>
        )}
      </div>

      {/* Fiyat aralığı */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Aylık Kira (¥)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-8 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={filters.priceMin}
            onChange={e => set({ priceMin: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            className="h-8 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={filters.priceMax}
            onChange={e => set({ priceMax: e.target.value })}
          />
        </div>
      </div>

      {/* Oda tipi */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Oda Tipi</Label>
        <div className="flex flex-wrap gap-1.5">
          {ROOM_TYPES.map(rt => (
            <button
              key={rt}
              type="button"
              onClick={() => set({ roomType: filters.roomType === rt ? '' : rt })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                filters.roomType === rt
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* Deprem standardı */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Deprem Standardı</Label>
        <div className="flex flex-wrap gap-1.5">
          {QUAKE_OPTIONS.map(q => (
            <button
              key={q.value}
              type="button"
              onClick={() => set({ quakeStandard: filters.quakeStandard === q.value ? '' : q.value })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                filters.quakeStandard === q.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Özellikler */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Özellikler</Label>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_OPTIONS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFeature(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                filters.features.includes(f.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aktif filtre sayısı */}
      {hasActive && (
        <div className="pt-1">
          <Badge variant="secondary" className="text-xs">
            {[filters.priceMin || filters.priceMax ? 1 : 0, filters.roomType ? 1 : 0, filters.quakeStandard ? 1 : 0, filters.features.length].reduce((a, b) => a + b, 0)} filtre aktif
          </Badge>
        </div>
      )}
    </div>
  );
};
