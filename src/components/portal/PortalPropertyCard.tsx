import { MapPin, Ruler, Users, Wifi, Car, PawPrint, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/store/usePropertyStore';

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  internet: <Wifi className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  pets: <PawPrint className="w-3.5 h-3.5" />,
};

interface Props {
  property: Property;
  onClick?: () => void;
}

export const PortalPropertyCard = ({ property, onClick }: Props) => {
  const visibleFeatures = (property.features ?? []).filter(f => FEATURE_ICONS[f]).slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Görsel */}
      <div className="h-44 bg-muted relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1">
          {property.roomType}
        </Badge>
        {property.price && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            ¥{property.price.toLocaleString()}/ay
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-snug line-clamp-2">{property.address}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5" /> {property.area} m²
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {property.tenantCapacity} kişi
          </span>
          <span>{property.buildYear}</span>
        </div>

        {visibleFeatures.length > 0 && (
          <div className="flex items-center gap-2">
            {visibleFeatures.map(f => (
              <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                {FEATURE_ICONS[f]} {f === 'internet' ? 'İnternet' : f === 'parking' ? 'Otopark' : 'Pet'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
