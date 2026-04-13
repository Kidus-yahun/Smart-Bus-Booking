import { useState } from 'react';
import { ArrowLeft, MapPin, Bus, Clock, Users, Star, Wifi, Zap, Phone, Navigation, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  amenities: string[];
  routes: Route[];
  facilities: Facility[];
  operatingHours: string;
  contact: string;
  rating: number;
  reviews: number;
  image: string;
}

interface Route {
  id: string;
  name: string;
  destination: string;
  nextBus: string;
  frequency: string;
  price: number;
  duration: number;
  occupancy: 'low' | 'medium' | 'high';
}

interface Facility {
  name: string;
  icon: string;
  available: boolean;
}

interface StationDetailProps {
  stationId: string;
  onBack: () => void;
  onBookRoute: (routeId: string) => void;
}

export function StationDetail({ stationId, onBack, onBookRoute }: StationDetailProps) {
  const [activeTab, setActiveTab] = useState<'routes' | 'facilities' | 'info'>('routes');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock station data - Ethiopian bus stations
  const stations: Record<string, Station> = {
    'bole-megenagna': {
      id: 'bole-megenagna',
      name: 'Bole Megenagna Station',
      address: 'Bole Megenagna, Addis Ababa',
      coordinates: { lat: 9.0192, lng: 38.7846 },
      description: 'One of the busiest transport hubs in Addis Ababa, connecting Bole area with city center and other major destinations.',
      amenities: ['wifi', 'restroom', 'shop', 'parking', 'security'],
      routes: [
        {
          id: '1',
          name: 'Bole Express',
          destination: 'Piazza',
          nextBus: '3 min',
          frequency: 'Every 5 min',
          price: 15,
          duration: 25,
          occupancy: 'medium'
        },
        {
          id: '2',
          name: 'Airport Shuttle',
          destination: 'Bole Airport',
          nextBus: '8 min',
          frequency: 'Every 15 min',
          price: 35,
          duration: 20,
          occupancy: 'low'
        },
        {
          id: '3',
          name: 'Ring Road Line',
          destination: 'CMC via Ring Road',
          nextBus: '12 min',
          frequency: 'Every 10 min',
          price: 20,
          duration: 35,
          occupancy: 'high'
        }
      ],
      facilities: [
        { name: 'WiFi', icon: '📶', available: true },
        { name: 'Restrooms', icon: '🚻', available: true },
        { name: 'Food Court', icon: '🍽️', available: true },
        { name: 'ATM', icon: '💳', available: true },
        { name: 'Parking', icon: '🅿️', available: true },
        { name: 'Security', icon: '🛡️', available: true },
        { name: 'Pharmacy', icon: '💊', available: false }
      ],
      operatingHours: '5:00 AM - 11:00 PM',
      contact: '+251-11-123-4567',
      rating: 4.3,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop'
    },
    'kazanchis': {
      id: 'kazanchis',
      name: 'Kazanchis Bus Terminal',
      address: 'Kazanchis, Addis Ababa',
      coordinates: { lat: 9.0320, lng: 38.7469 },
      description: 'Central terminal serving multiple routes across Addis Ababa with modern facilities and frequent services.',
      amenities: ['wifi', 'restroom', 'shop', 'ticketing', 'waiting'],
      routes: [
        {
          id: '4',
          name: 'City Center Express',
          destination: 'Piazza',
          nextBus: '2 min',
          frequency: 'Every 3 min',
          price: 12,
          duration: 15,
          occupancy: 'medium'
        },
        {
          id: '5',
          name: 'University Line',
          destination: 'Addis Ababa University',
          nextBus: '5 min',
          frequency: 'Every 8 min',
          price: 10,
          duration: 18,
          occupancy: 'high'
        },
        {
          id: '6',
          name: 'Commercial Route',
          destination: 'CMC',
          nextBus: '7 min',
          frequency: 'Every 6 min',
          price: 14,
          duration: 22,
          occupancy: 'low'
        }
      ],
      facilities: [
        { name: 'WiFi', icon: '📶', available: true },
        { name: 'Restrooms', icon: '🚻', available: true },
        { name: 'Ticket Office', icon: '🎫', available: true },
        { name: 'Waiting Area', icon: '💺', available: true },
        { name: 'Information Desk', icon: 'ℹ️', available: true },
        { name: 'Coffee Shop', icon: '☕', available: true },
        { name: 'Luggage Storage', icon: '🧳', available: false }
      ],
      operatingHours: '4:30 AM - 12:00 AM',
      contact: '+251-11-456-7890',
      rating: 4.5,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop'
    },
    'merkato': {
      id: 'merkato',
      name: 'Merkato Bus Station',
      address: 'Merkato, Addis Ababa',
      coordinates: { lat: 9.0155, lng: 38.7378 },
      description: 'Major transportation hub serving Africa\'s largest market area with connections throughout the city.',
      amenities: ['restroom', 'shop', 'market', 'security', 'food'],
      routes: [
        {
          id: '7',
          name: 'Market Express',
          destination: '6 Kilo',
          nextBus: '4 min',
          frequency: 'Every 4 min',
          price: 18,
          duration: 30,
          occupancy: 'high'
        },
        {
          id: '8',
          name: 'Stadium Route',
          destination: 'Stadium',
          nextBus: '9 min',
          frequency: 'Every 12 min',
          price: 16,
          duration: 28,
          occupancy: 'medium'
        },
        {
          id: '9',
          name: 'Ring Road Express',
          destination: 'Bole via Ring Road',
          nextBus: '15 min',
          frequency: 'Every 20 min',
          price: 25,
          duration: 45,
          occupancy: 'low'
        }
      ],
      facilities: [
        { name: 'Restrooms', icon: '🚻', available: true },
        { name: 'Market Access', icon: '🏪', available: true },
        { name: 'Food Vendors', icon: '🍽️', available: true },
        { name: 'Security', icon: '🛡️', available: true },
        { name: 'Money Exchange', icon: '💱', available: true },
        { name: 'WiFi', icon: '📶', available: false },
        { name: 'Air Conditioning', icon: '❄️', available: false }
      ],
      operatingHours: '5:30 AM - 10:30 PM',
      contact: '+251-11-789-0123',
      rating: 4.1,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop'
    }
  };

  const station = stations[stationId];

  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 text-center">
          <h3 className="font-medium mb-2">Station not found</h3>
          <Button onClick={onBack}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const getOccupancyColor = (occupancy: Route['occupancy']) => {
    switch (occupancy) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const getOccupancyLabel = (occupancy: Route['occupancy']) => {
    switch (occupancy) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image & Basic Info */}
      <div className="relative">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${station.image})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Button
              variant="secondary"
              size="icon"
              onClick={onBack}
              className="bg-white/90 hover:bg-white text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-4 bg-background border-b">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-xl font-medium">{station.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{station.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{station.rating}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {station.reviews} reviews
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {station.description}
          </p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="routes">Routes ({station.routes.length})</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="mt-4 space-y-3">
            {station.routes.map((route) => (
              <Card key={route.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{route.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Navigation className="w-4 h-4" />
                      <span>To {route.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{route.price} ETB</div>
                    <div className="text-sm text-muted-foreground">{route.duration} min</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Next: {route.nextBus}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {route.frequency}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${getOccupancyColor(route.occupancy)}`} />
                    <span className={`text-sm ${getOccupancyColor(route.occupancy)}`}>
                      {getOccupancyLabel(route.occupancy)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => onBookRoute(route.id)}
                >
                  Book This Route
                </Button>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="facilities" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {station.facilities.map((facility, index) => (
                <Card key={index} className={`p-4 ${!facility.available ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{facility.icon}</span>
                    <div>
                      <div className="font-medium">{facility.name}</div>
                      <Badge 
                        variant={facility.available ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {facility.available ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-3">Operating Hours</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{station.operatingHours}</span>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{station.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-3">Available Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {station.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Directions
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Station
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}