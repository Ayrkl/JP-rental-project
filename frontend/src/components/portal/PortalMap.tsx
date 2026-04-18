import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '@/store/usePropertyStore';
import { useTranslation } from 'react-i18next';

const createPin = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
    <path fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 18 9 18s9-11.25 9-18c0-4.97-4.03-9-9-9z"/>
    <circle cx="12" cy="9" r="4" fill="#fff"/>
  </svg>`;
  return L.divIcon({ html: svg, className: 'portal-pin', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41] });
};

interface Props {
  properties: Property[];
  onSelect?: (property: Property) => void;
}

export const PortalMap = ({ properties, onSelect }: Props) => {
  const { t: tRaw } = useTranslation('portal');
  const t = tRaw as unknown as (key: string, opts?: Record<string, unknown>) => string;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-full w-full bg-muted animate-pulse rounded-xl" />;

  const center: [number, number] = properties.length > 0 && properties[0].coordinates
    ? [properties[0].coordinates.lat, properties[0].coordinates.lng]
    : [35.6762, 139.6503];

  const pin = createPin();

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border">
      <MapContainer center={center} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map(p => {
          const latOff = (parseInt(p.id.substring(0, 3), 36) % 100) / 1000;
          const lngOff = (parseInt(p.id.substring(3, 6), 36) % 100) / 1000;
          const pos: [number, number] = p.coordinates
            ? [p.coordinates.lat, p.coordinates.lng]
            : [35.6762 + latOff, 139.6503 + lngOff];

          return (
            <Marker key={p.id} position={pos} icon={pin}>
              <Popup>
                <div className="p-1 min-w-[140px] space-y-1">
                  <p className="text-xs font-semibold leading-snug">{p.address}</p>
                  <p className="text-xs text-gray-500">{p.roomType} · {p.area} m²</p>
                  {p.price && <p className="text-xs font-bold text-blue-600">¥{p.price.toLocaleString()}{t('perMonth')}</p>}
                  {onSelect && (
                    <button
                      onClick={() => onSelect(p)}
                      className="mt-1 text-[10px] bg-blue-600 text-white px-2 py-1 rounded w-full hover:bg-blue-700 transition-colors"
                    >
                      {t('viewDetails')}
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
