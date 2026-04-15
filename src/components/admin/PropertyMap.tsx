import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '../../store/usePropertyStore';
import type { ContractStatus } from './useContractStore';
import { useEffect, useState } from 'react';

// Sözleşme durumuna göre pin renkleri
const getMarkerColor = (status: ContractStatus | null): string => {
  if (!status) return '#10b981'; // Yeşil: Müsait (boş)
  switch (status) {
    case 'Aktif':
      return '#3b82f6'; // Mavi: Kiracılı/dolu
    case 'Taslak':
      return '#f97316'; // Turuncu: Ödeme gecikmiş
    case 'Sona Erdi':
      return '#ec4899'; // Kırmızı: Tahliye süreci aktif
    case 'Feshedildi':
      return '#6b7280'; // Gri: Bakımda
    default:
      return '#10b981';
  }
};

// Dinamik renkli marker oluştur
const createColoredIcon = (color: string) => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41">
      <path fill="${color}" stroke="#000" stroke-width="1" d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 18 9 18s9-11.25 9-18c0-4.97-4.03-9-9-9z"/>
      <circle cx="12" cy="9" r="4" fill="#fff"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty: (id: string) => void;
  contractStatuses?: Map<string, ContractStatus>; // propertyId -> ContractStatus
}

export const PropertyMap = ({ properties, onSelectProperty, contractStatuses }: PropertyMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full bg-muted animate-pulse" />;
  }

  // İlk mülkün koordinatlarına veya Tokyo merkezine odaklan
  const mapCenter: [number, number] = properties.length > 0 && properties[0].coordinates 
    ? [properties[0].coordinates.lat, properties[0].coordinates.lng]
    : [35.6762, 139.6503];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-muted/20">
      <MapContainer 
        center={mapCenter} 
        zoom={11} 
        scrollWheelZoom={true}
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

          const contractStatus = contractStatuses?.get(p.id) || null;
          const markerColor = getMarkerColor(contractStatus);
          const coloredIcon = createColoredIcon(markerColor);

          return (
            <Marker key={p.id} position={pos} icon={coloredIcon}>
              <Popup>
                <div className="p-1 min-w-[120px]">
                  <h4 className="font-bold text-sm">Mülk</h4>
                  <p className="text-[11px] mb-2 opacity-80">{p.address}</p>
                  {contractStatus && (
                    <p className="text-[10px] mb-2 font-semibold" style={{ color: markerColor }}>
                      Durum: {contractStatus}
                    </p>
                  )}
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
