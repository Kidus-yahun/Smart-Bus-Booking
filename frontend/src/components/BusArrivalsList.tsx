import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, MoreVertical, Accessibility } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { BusDetailsModal } from './BusDetailsModal';

interface BusArrival {
  id: string;
  busNumber: string;
  destination: string;
  estimatedArrival: number;
  departureTime: string;
  capacity: number;
  currentOccupancy: number;
  price: number;
  accessibility: boolean;
  seatsStatus: 'available' | 'some' | 'standing';
}

interface BusArrivalsListProps {
  onSelectBus: (busId: string) => void;
}

type LatLng = { lat: number; lng: number };

type Station = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
};

// Demo-only: phone sends GPS and we compute ETA to the nearest station to the user.
const DEMO_BUS_ID = 'demo-bus';
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

const STATIONS: Station[] = [
  { id: 'meskel-square', name: 'Meskel Square Station', city: 'Addis Ababa', lat: 9.0084, lng: 38.7635 },
  { id: 'piazza', name: 'Piazza Station', city: 'Addis Ababa', lat: 9.0370, lng: 38.7578 },
  { id: 'bole-airport', name: 'Bole Airport Terminal', city: 'Addis Ababa', lat: 8.9781, lng: 38.7991 },
  { id: 'merkato', name: 'Merkato Bus Station', city: 'Addis Ababa', lat: 9.0142, lng: 38.7225 },
  { id: 'cmc', name: 'CMC Station (Cherkos)', city: 'Addis Ababa', lat: 9.0267, lng: 38.8047 },
  { id: 'kazanchis', name: 'Kazanchis Station', city: 'Addis Ababa', lat: 9.0201, lng: 38.7596 },
  { id: 'arat-kilo', name: 'Arat Kilo Station', city: 'Addis Ababa', lat: 9.0334, lng: 38.7515 },
  { id: 'stadium', name: 'Stadium Station', city: 'Addis Ababa', lat: 9.0156, lng: 38.7467 },
];

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatEtaMinutes(etaSeconds: number): number {
  // Prefer a user-friendly rounded-up ETA.
  const minutes = etaSeconds / 60;
  return Math.max(0, Math.ceil(minutes));
}

export function BusArrivalsList({ onSelectBus }: BusArrivalsListProps) {
  const [selectedBusForDetails, setSelectedBusForDetails] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [demoBusPosition, setDemoBusPosition] = useState<{ pos: LatLng; timestamp: number } | null>(null);
  const [demoBusSpeedMps, setDemoBusSpeedMps] = useState<number | null>(null);
  const lastDemoBusRef = useRef<{ pos: LatLng; timestamp: number } | null>(null);

  const backendUrl = useMemo(() => {
    const v = (import.meta as any).env?.VITE_BACKEND_URL;
    return (typeof v === 'string' && v.trim()) ? v.trim() : DEFAULT_BACKEND_URL;
  }, []);

  const arrivalsBase: BusArrival[] = [
    {
      id: '1',
      busNumber: 'AA-01',
      destination: 'Bole Airport',
      estimatedArrival: 0,
      departureTime: '2:15 PM',
      capacity: 45,
      currentOccupancy: 20,
      price: 35,
      accessibility: true,
      seatsStatus: 'available'
    },
    {
      id: '2',
      busNumber: 'AA-05',
      destination: 'Merkato',
      estimatedArrival: 0,
      departureTime: '2:18 PM',
      capacity: 50,
      currentOccupancy: 35,
      price: 18,
      accessibility: true,
      seatsStatus: 'some'
    },
    {
      id: '3',
      busNumber: 'AA-12',
      destination: 'Addis Ababa University',
      estimatedArrival: 0,
      departureTime: '2:22 PM',
      capacity: 42,
      currentOccupancy: 42,
      price: 15,
      accessibility: false,
      seatsStatus: 'standing'
    },
    {
      id: '4',
      busNumber: 'AA-03',
      destination: 'Piazza',
      estimatedArrival: 0,
      departureTime: '2:25 PM',
      capacity: 40,
      currentOccupancy: 18,
      price: 12,
      accessibility: true,
      seatsStatus: 'available'
    }
  ];

  const [arrivals, setArrivals] = useState<BusArrival[]>(arrivalsBase);

  const nearestStation = useMemo(() => {
    if (!userLocation) return null;
    let best: Station | null = null;
    let bestKm = Infinity;
    for (const s of STATIONS) {
      const km = haversineKm(userLocation, { lat: s.lat, lng: s.lng });
      if (km < bestKm) {
        bestKm = km;
        best = s;
      }
    }
    return best;
  }, [userLocation]);

  const computedEtaMinutes = useMemo(() => {
    if (!demoBusPosition || !nearestStation || demoBusSpeedMps === null) return null;

    // Avoid exploding ETAs when the bus is stopped / GPS jitter.
    const MIN_SPEED_MPS = 0.35; // ~1.3 km/h
    if (demoBusSpeedMps < MIN_SPEED_MPS) return null;

    const distanceKm = haversineKm(
      demoBusPosition.pos,
      { lat: nearestStation.lat, lng: nearestStation.lng }
    );
    const distanceM = distanceKm * 1000;
    if (!Number.isFinite(distanceM) || distanceM <= 0) return 0;

    const etaSeconds = distanceM / demoBusSpeedMps;
    if (!Number.isFinite(etaSeconds) || etaSeconds < 0) return null;

    return formatEtaMinutes(etaSeconds);
  }, [demoBusPosition, nearestStation, demoBusSpeedMps]);

  useEffect(() => {
    // 1) PC user location (used to pick the nearest station).
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  }, []);

  useEffect(() => {
    // 2) Poll phone "bus" GPS from backend.
    let cancelled = false;

    const poll = async () => {
      try {
        const url = `${backendUrl}/api/realtime/demo/bus-location?busId=${encodeURIComponent(DEMO_BUS_ID)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();

        if (cancelled) return;
        const ts = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        setDemoBusPosition({ pos: { lat: data.lat, lng: data.lng }, timestamp: ts });
      } catch {
        // Prototype: ignore network errors and keep UI fallback.
      }
    };

    poll();
    const id = window.setInterval(poll, 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [backendUrl]);

  useEffect(() => {
    // 3) Estimate bus speed from consecutive GPS updates.
    if (!demoBusPosition) return;

    const last = lastDemoBusRef.current;
    if (last) {
      const dtSeconds = (demoBusPosition.timestamp - last.timestamp) / 1000;
      if (dtSeconds > 0.1) {
        const distM = haversineKm(last.pos, demoBusPosition.pos) * 1000;
        const speed = distM / dtSeconds;
        if (Number.isFinite(speed)) setDemoBusSpeedMps(speed);
      }
    }

    lastDemoBusRef.current = demoBusPosition;
  }, [demoBusPosition]);

  useEffect(() => {
    // 4) Replace mock estimatedArrival minutes with computed ETA.
    if (computedEtaMinutes === null) return;
    setArrivals((prev) => prev.map((a) => ({ ...a, estimatedArrival: computedEtaMinutes })));
  }, [computedEtaMinutes]);

  const getSeatsStatusColor = (status: BusArrival['seatsStatus']) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'some':
        return 'text-yellow-600';
      case 'standing':
        return 'text-red-600';
    }
  };

  const getSeatsStatusLabel = (status: BusArrival['seatsStatus']) => {
    switch (status) {
      case 'available':
        return 'Available seats';
      case 'some':
        return 'Some seats';
      case 'standing':
        return 'Standing room';
    }
  };

  const getSeatsStatusDot = (status: BusArrival['seatsStatus']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'some':
        return 'bg-yellow-500';
      case 'standing':
        return 'bg-red-500';
    }
  };

  // Mock detailed bus information
  const getBusDetails = (busId: string) => {
    const arrival = arrivals.find(a => a.id === busId);
    if (!arrival) return null;

    return {
      id: arrival.id,
      busNumber: arrival.busNumber,
      route: `${arrival.busNumber} Express Line`,
      from: nearestStation ? nearestStation.name : 'Meskel Square Station',
      to: arrival.destination,
      estimatedArrival: computedEtaMinutes ?? arrival.estimatedArrival,
      departureTime: arrival.departureTime,
      capacity: arrival.capacity,
      currentOccupancy: arrival.currentOccupancy,
      price: arrival.price,
      rating: 4.2 + Math.random() * 0.6,
      amenities: ['wifi', 'ac', 'charging'],
      accessibility: arrival.accessibility,
      busType: 'express' as const,
      driverInfo: {
        name: 'Abebe Tadesse',
        rating: 4.8,
        experience: '8 years'
      },
      routeStops: ['Meskel Square', 'Mexico', 'Kazanchis', arrival.destination],
      nextStops: [
        { name: 'Mexico', eta: '2 min' },
        { name: 'Kazanchis', eta: '5 min' },
        {
          name: arrival.destination,
          eta: `${computedEtaMinutes ?? arrival.estimatedArrival} min`
        }
      ]
    };
  };

  const handleShowDetails = (busId: string) => {
    setSelectedBusForDetails(busId);
  };

  const handleCloseDetails = () => {
    setSelectedBusForDetails(null);
  };

  const handleBookFromDetails = () => {
    if (selectedBusForDetails) {
      onSelectBus(selectedBusForDetails);
      setSelectedBusForDetails(null);
    }
  };

  return (
    <div>
      <h2 className="font-medium mb-4">Next Arrivals</h2>
      <div className="text-sm text-muted-foreground mb-3">
        {nearestStation
          ? `${nearestStation.name} - ${nearestStation.city}`
          : 'Finding nearest station...'}
      </div>
      
      <div className="space-y-3">
        {arrivals.map((arrival) => (
          <Card key={arrival.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-black dark:bg-white dark:text-black text-white px-2 py-1 rounded text-sm font-medium">
                  {arrival.busNumber}
                </div>
                <div>
                  <div className="font-medium">{arrival.destination}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-medium">
                    {computedEtaMinutes === null ? '...' : `${arrival.estimatedArrival} min`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handleShowDetails(arrival.id)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{arrival.departureTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getSeatsStatusDot(arrival.seatsStatus)}`} />
                <span className={getSeatsStatusColor(arrival.seatsStatus)}>
                  {getSeatsStatusLabel(arrival.seatsStatus)}
                </span>
              </div>
              
              {arrival.accessibility && (
                <div className="flex items-center gap-1">
                  <Accessibility className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600">Accessible</span>
                </div>
              )}
            </div>

            <Button 
              className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              onClick={() => onSelectBus(arrival.id)}
            >
              Buy Ticket
            </Button>
          </Card>
        ))}
      </div>

      {/* Bus Details Modal */}
      {selectedBusForDetails && (
        <BusDetailsModal
          busDetails={getBusDetails(selectedBusForDetails)!}
          onClose={handleCloseDetails}
          onBookTicket={handleBookFromDetails}
        />
      )}
    </div>
  );
}