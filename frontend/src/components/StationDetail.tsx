import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bus, Loader2, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import { busesApi } from '../lib/api';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface StationDetailProps {
  stationId: string;
  onBack: () => void;
  onBookRoute: (routeId: string) => void;
}

export function StationDetail({ stationId, onBack, onBookRoute }: StationDetailProps) {
  const [activeTab, setActiveTab] = useState<'routes' | 'info'>('routes');

  const { data: station, isLoading: stationLoading } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => busesApi.getStation(parseInt(stationId, 10)),
    enabled: !!stationId,
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => busesApi.getRoutes(),
  });

  const stationRoutes =
    routes?.filter(
      (route) =>
        route.origin_station_id === parseInt(stationId, 10) ||
        route.destination_station_id === parseInt(stationId, 10)
    ) || [];

  const _getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (stationLoading || routesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!station) {
    return (
      <Card className="p-4">
        <p className="text-red-500">Station not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const facilities = station.facilities ? JSON.parse(station.facilities) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{station.name}</h2>
      </div>

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm">{station.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'routes' | 'info')}>
        <TabsList className="w-full">
          <TabsTrigger value="routes" className="flex-1">
            Routes
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1">
            Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-3 mt-4">
          {stationRoutes.length > 0 ? (
            stationRoutes.map((route) => (
              <Card key={route.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bus className="h-4 w-4" />
                      <span className="font-medium">{route.route_number}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{route.route_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{route.distance_km} km</span>
                      <span>{route.estimated_duration_minutes} min</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onBookRoute(route.id.toString())}>
                    Book
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 text-center">
              <p className="text-muted-foreground">No routes found for this station</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-3 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {facilities.length > 0 ? (
                facilities.map((facility: string) => (
                  <Badge key={facility} variant="outline">
                    {facility.replace('_', ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No facilities listed</p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Location</h3>
            <Button variant="outline" className="w-full" asChild>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
