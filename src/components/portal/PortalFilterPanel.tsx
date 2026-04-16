import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export type PortalFilters = {
  priceMin: string;
  priceMax: string;
  roomType: string;
  quakeStandard: string;
  features: string[];
};

const ROOM_TYPES = ['1K', '1LDK', '2LDK', '3LDK', '4LDK'];
const QUAKE_OPTION_KEYS = [
  { value: '', labelKey: 'filterAll' },
  { value: 'old', labelKey: 'filterOldStandard' },
  { value: 'new', labelKey: 'filterNewStandard' },
  { value: 'grade2', labelKey: 'filterGrade2' },
  { value: 'grade3', labelKey: 'filterGrade3' },
];
const FEATURE_OPTION_KEYS = [
  { id: 'internet', labelKey: 'featureInternet' },
  { id: 'elevator', labelKey: 'featureElevator' },
  { id: 'parking', labelKey: 'featureParking' },
  { id: 'pets', labelKey: 'featurePets' },
  { id: 'autolock', labelKey: 'featureAutolock' },
  { id: 'balcony', labelKey: 'featureBalcony' },
];

interface Props {
  filters: PortalFilters;
  onChange: (filters: PortalFilters) => void;
  onReset: () => void;
}

export const PortalFilterPanel = ({ filters, onChange, onReset }: Props) => {
  const { t: tRaw } = useTranslation('portal');
  const t = tRaw as unknown as (key: string, opts?: Record<string, unknown>) => string;

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
        <h3 className="text-sm font-semibold">{t('filterTitle')}</h3>
        {hasActive && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={onReset}>
            <X className="w-3 h-3" /> {t('filterClear')}
          </Button>
        )}
      </div>

      {/* Fiyat aralığı */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">{t('filterPriceLabel')}</Label>
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
        <Label className="text-xs text-muted-foreground">{t('filterRoomType')}</Label>
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
        <Label className="text-xs text-muted-foreground">{t('filterQuake')}</Label>
        <div className="flex flex-wrap gap-1.5">
          {QUAKE_OPTION_KEYS.map(q => (
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
              {t(q.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Özellikler */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">{t('filterFeatures')}</Label>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_OPTION_KEYS.map(f => (
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
              {t(f.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Aktif filtre sayısı */}
      {hasActive && (
        <div className="pt-1">
          <Badge variant="secondary" className="text-xs">
            {t('filterActiveCount', { count: [filters.priceMin || filters.priceMax ? 1 : 0, filters.roomType ? 1 : 0, filters.quakeStandard ? 1 : 0, filters.features.length].reduce((a, b) => a + b, 0) })}
          </Badge>
        </div>
      )}
    </div>
  );
};
