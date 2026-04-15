import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { Button } from './ui/button';
import { Card } from './ui/card';
import 'leaflet/dist/leaflet.css';

interface MapCardProps {
  onOpenMap: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER: [number, number] = [9.0084, 38.7635];

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export function MapCard({ onOpenMap, userLocation }: MapCardProps) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : DEFAULT_CENTER;

  const userMarkerIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  return (
    <Card className="p-0 overflow-hidden" onClick={onOpenMap}>
      <div className="relative h-36 w-full">
        <MapContainer
          center={center}
          zoom={13}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '144px' }}
        >
          <MapUpdater center={center} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon} />
          )}
        </MapContainer>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />

        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Track Nearby Buses</p>
              <p className="text-xs text-white/70">
                {userLocation ? 'Live location enabled' : 'Tap to enable location'}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMap();
            }}
          >
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
}