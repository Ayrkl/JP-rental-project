import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '../../store/usePropertyStore';
import { useEffect, useState } from 'react';

// İkon düzeltmesini bir kez yapalım
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty: (id: string) => void;
}

export const PropertyMap = ({ properties, onSelectProperty }: PropertyMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full bg-muted animate-pulse" />;
  }

  const center: [number, number] = [35.6762, 139.6503];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-muted/20">
      <MapContainer 
        center={center} 
        zoom={11} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((p) => {
          // Sabit koordinatlar (random çakışmayı önlemek için p.id kullanıyoruz)
          const latOffset = (parseInt(p.id.substring(0, 3), 36) % 100) / 1000;
          const lngOffset = (parseInt(p.id.substring(3, 6), 36) % 100) / 1000;
          
          const pos: [number, number] = p.coordinates 
            ? [p.coordinates.lat, p.coordinates.lng]
            : [35.6762 + latOffset, 139.6503 + lngOffset];

          return (
            <Marker key={p.id} position={pos} icon={icon}>
              <Popup>
                <div className="p-1 min-w-[120px]">
                  <h4 className="font-bold text-sm">Mülk #{p.id.toUpperCase()}</h4>
                  <p className="text-[11px] mb-2 opacity-80">{p.address}</p>
                  <button 
                    onClick={() => onSelectProperty(p.id)}
                    className="text-[10px] bg-primary text-primary-foreground px-2 py-1.5 rounded-md hover:opacity-90 w-full transition-all"
                  >
                    Detayları Gör
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
