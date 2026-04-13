import { useEffect } from 'react';
import { X, MapPin, Clock, Users, Star, Wifi, Zap, Phone, Navigation, Bus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface BusDetails {
  id: string;
  busNumber: string;
  route: string;
  from: string;
  to: string;
  estimatedArrival: number;
  departureTime: string;
  capacity: number;
  currentOccupancy: number;
  price: number;
  rating: number;
  amenities: string[];
  accessibility: boolean;
  busType: 'standard' | 'express' | 'premium';
  driverInfo: {
    name: string;
    rating: number;
    experience: string;
  };
  routeStops: string[];
  nextStops: { name: string; eta: string }[];
}

interface BusDetailsModalProps {
  busDetails: BusDetails;
  onClose: () => void;
  onBookTicket: () => void;
}

export function BusDetailsModal({ busDetails, onClose, onBookTicket }: BusDetailsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getOccupancyColor = () => {
    const percentage = (busDetails.currentOccupancy / busDetails.capacity) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOccupancyLabel = () => {
    const percentage = (busDetails.currentOccupancy / busDetails.capacity) * 100;
    if (percentage < 50) return 'Available seats';
    if (percentage < 80) return 'Some seats';
    return 'Standing room';
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, string> = {
      wifi: '📶',
      ac: '❄️',
      charging: '🔌',
      toilet: '🚻',
      entertainment: '📺'
    };
    return icons[amenity] || '✅';
  };

  const getBusTypeColor = () => {
    switch (busDetails.busType) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'express':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end" onClick={onClose}>
      <div className="bg-background w-full max-h-[90vh] rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Bus className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-medium">{busDetails.busNumber}</h2>
                <p className="text-sm text-primary-foreground/80">{busDetails.route}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getBusTypeColor()}>
              {busDetails.busType.charAt(0).toUpperCase() + busDetails.busType.slice(1)}
            </Badge>
            {busDetails.accessibility && (
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                ♿ Accessible
              </Badge>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{busDetails.rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Route Information */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Route Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{busDetails.from}</span>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{busDetails.to}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Departure: {busDetails.departureTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">ETA: {busDetails.estimatedArrival} min</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Occupancy Status */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Current Status</h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${getOccupancyColor()}`} />
                <span className={`font-medium ${getOccupancyColor()}`}>
                  {getOccupancyLabel()}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {busDetails.currentOccupancy}/{busDetails.capacity} passengers
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  busDetails.currentOccupancy / busDetails.capacity < 0.5 ? 'bg-green-500' :
                  busDetails.currentOccupancy / busDetails.capacity < 0.8 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(busDetails.currentOccupancy / busDetails.capacity) * 100}%` }}
              />
            </div>
          </Card>

          {/* Next Stops */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Next Stops</h3>
            <div className="space-y-2">
              {busDetails.nextStops.map((stop, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    <span className={`text-sm ${index === 0 ? 'font-medium' : ''}`}>{stop.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stop.eta}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Bus Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {busDetails.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <span className="text-lg">{getAmenityIcon(amenity)}</span>
                  <span className="text-sm capitalize">{amenity === 'ac' ? 'Air Conditioning' : amenity}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Driver Information */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Driver Information</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{busDetails.driverInfo.name}</div>
                <div className="text-sm text-muted-foreground">{busDetails.driverInfo.experience} experience</div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{busDetails.driverInfo.rating}</span>
              </div>
            </div>
          </Card>

          {/* Price Information */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Ticket Price</h3>
                <p className="text-sm text-muted-foreground">Per passenger</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium">{busDetails.price} ETB</div>
                <div className="text-sm text-muted-foreground">One way</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Track Live
            </Button>
            <Button className="flex-1" onClick={onBookTicket}>
              Buy Ticket - {busDetails.price} ETB
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}