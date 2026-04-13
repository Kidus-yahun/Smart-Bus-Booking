import { useQuery } from '@tanstack/react-query';
import { Accessibility, Clock, Loader2 } from 'lucide-react';
import { busesApi } from '../lib/api';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BusArrivalsListProps {
  onSelectBus: (busId: string) => void;
}

export function BusArrivalsList({ onSelectBus }: BusArrivalsListProps) {
  const {
    data: arrivals,
    isLoading: arrivalsLoading,
    error: arrivalsError,
  } = useQuery({
    queryKey: ['busArrivals'],
    queryFn: () => busesApi.getUpcomingArrivals(20),
    refetchInterval: 30000,
  });

  const getOccupancyLabel = (occupancy: string) => {
    switch (occupancy) {
      case 'low':
        return 'Available seats';
      case 'medium':
        return 'Filling up';
      case 'high':
        return 'Almost full';
      default:
        return 'Unknown';
    }
  };

  const getOccupancyColor = (occupancy: string) => {
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

  if (arrivalsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (arrivalsError) {
    return (
      <Card className="p-4">
        <p className="text-red-500">Failed to load bus arrivals. Please try again.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Buses</h2>
        <span className="text-sm text-muted-foreground">{arrivals?.length || 0} buses</span>
      </div>

      {arrivals && arrivals.length > 0 ? (
        arrivals.map((arrival) => (
          <Card key={arrival.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-lg">{arrival.route_number}</span>
                  {arrival.accessible && <Accessibility className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">to {arrival.destination}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{arrival.arrival_time}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {arrival.minutes_away > 0 ? `${arrival.minutes_away} min` : 'Arriving'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`w-3 h-3 rounded-full ${getOccupancyColor(arrival.occupancy)} mb-2 ml-auto`}
                />
                <p className="text-xs text-muted-foreground">
                  {getOccupancyLabel(arrival.occupancy)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => onSelectBus(arrival.bus_id.toString())}
              >
                Book Now
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No buses arriving soon</p>
        </Card>
      )}
    </div>
  );
}
