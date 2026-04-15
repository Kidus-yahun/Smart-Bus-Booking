import L from 'leaflet';
import { Bus, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { busesApi } from '../lib/api';
import { Button } from './ui/button';
import { Sheet, SheetContent } from './ui/sheet';
import 'leaflet/dist/leaflet.css';

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface BusPosition {
  bus_id: string;
  lat: number;
  lng: number;
}

interface MapBottomSheetProps {
  open: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER: [number, number] = [9.0084, 38.7635]; // Addis Ababa
const DEFAULT_ZOOM = 13;

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, DEFAULT_ZOOM);
  return null;
}

export function MapBottomSheet({ open, onClose, userLocation }: MapBottomSheetProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [busPositions, setBusPositions] = useState<BusPosition[]>([]);
  const [loading, setLoading] = useState(true);

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : DEFAULT_CENTER;

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [stationsData, routesData] = await Promise.all([
          busesApi.getStations(),
          busesApi.getRoutes(),
        ]);
        setStations(stationsData as Station[]);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const fetchBusPositions = async () => {
      try {
        const buses = await busesApi.getBuses();
        const busesData = Array.isArray(buses) ? buses : [];

        const positions: BusPosition[] = busesData
          .filter((bus) => bus.current_latitude && bus.current_longitude)
          .map((bus) => ({
            bus_id: bus.id.toString(),
            lat: bus.current_latitude!,
            lng: bus.current_longitude!,
          }));

        setBusPositions(positions);
      } catch (error) {
        console.error('Failed to fetch bus positions:', error);
      }
    };

    fetchBusPositions();
    const interval = setInterval(fetchBusPositions, 10000);
    return () => clearInterval(interval);
  }, [open]);

  const userMarkerIcon = L.divIcon({
    className: 'user-marker-icon',
    html: '<div class="marker-inner marker-user"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const stationMarkerIcon = L.divIcon({
    className: 'station-marker-icon',
    html: '<div class="marker-inner marker-station"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const busMarkerIcon = L.divIcon({
    className: 'bus-marker-icon',
    html: '<div class="marker-inner marker-bus"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom">
        <div className="flex flex-col h-full max-w-md mx-auto w-full">
          <div className="flex items-center justify-between p-4 border-b bg-muted/30 rounded-t-xl">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Nearby Buses</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <MapContainer
              center={center}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%', minHeight: '300px' }}
              zoomControl={true}
            >
              <MapUpdater center={center} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
                  <Popup>Your location</Popup>
                </Marker>
              )}

              {stations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={stationMarkerIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="h-4 w-4" />
                        {station.name}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {busPositions.map((bus) => (
                <Marker key={bus.bus_id} position={[bus.lat, bus.lng]} icon={busMarkerIcon}>
                  <Popup>
                    <div className="p-1">
                      <div className="flex items-center gap-1 font-medium">
                        <Bus className="h-4 w-4" />
                        Bus {bus.bus_id}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="p-4 border-t bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground mb-3">Map Legend</p>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md" 
                  style={{ backgroundColor: '#3b82f6' }}
                />
                <span className="text-xs font-medium">Your Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md" 
                  style={{ backgroundColor: '#f97316' }}
                />
                <span className="text-xs font-medium">Bus Stations</span>
              </div>
              <div className="flex items-center gap-1">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md" 
                  style={{ backgroundColor: '#10b981' }}
                />
                <span className="text-xs font-medium">Live Buses</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
