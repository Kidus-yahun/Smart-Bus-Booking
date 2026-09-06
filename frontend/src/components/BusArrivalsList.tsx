import { useQuery } from '@tanstack/react-query';
import { Accessibility, Clock, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { busesApi } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { BusDetailsModal } from './BusDetailsModal';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BusArrivalsListProps {
  onSelectBus: (busId: string, destinationStationId?: number, boardingStationId?: number) => void;
}

export function BusArrivalsList({ onSelectBus }: BusArrivalsListProps) {
  const { t } = useLanguage();
  const {
    data: arrivals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['busArrivals'],
    queryFn: () => busesApi.getUpcomingArrivals(20),
    refetchInterval: 30000,
  });

  const [selectedBusForDetails, setSelectedBusForDetails] = useState<string | null>(null);

  const handleOpenDetails = (busId: string) => {
    setSelectedBusForDetails(busId);
  };

  const handleCloseDetails = () => {
    setSelectedBusForDetails(null);
  };

  const handleBookFromDetails = () => {
    if (selectedBusForDetails) {
      const arrival = arrivals?.find((a) => a.id === selectedBusForDetails);
      onSelectBus(selectedBusForDetails, arrival?.destination_station_id, arrival?.origin_station_id);
      handleCloseDetails();
    }
  };

  const _getSeatsStatusDot = (status: string) => {
    switch (status) {
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

  const _getOccupancyLabel = (occupancy: string) => {
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
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">{t('Failed to load bus arrivals. Please try again.')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('Upcoming Buses')}</h2>
        <span className="text-sm text-muted-foreground">{arrivals?.length || 0} {t('buses')}</span>
      </div>

      {arrivals && arrivals.length > 0 ? (
        arrivals.map((arrival) => (
          <Card key={arrival.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{arrival.route_number}</span>
                  {arrival.accessible && <Accessibility className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('to {0}', arrival.destination)}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{arrival.arrival_time}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {arrival.minutes_away > 0 ? t('{0} min', arrival.minutes_away) : t('Arriving now')}
                  </span>
                  <span className={getOccupancyColor(arrival.occupancy)}>
                    {arrival.occupancy === 'low'
                      ? t('Seats available')
                      : arrival.occupancy === 'medium'
                        ? t('Filling up')
                        : t('Almost full')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDetails(arrival.id)}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <Button
                className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                onClick={() => onSelectBus(arrival.id, arrival.destination_station_id, arrival.origin_station_id)}
              >
                {t('Buy Ticket')}
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{t('No buses arriving soon')}</p>
        </Card>
      )}

      {selectedBusForDetails && (
        <BusDetailsModal
          busDetails={{
            id: selectedBusForDetails,
            busNumber: arrivals?.find((a) => a.id === selectedBusForDetails)?.route_number || '',
            route: t(arrivals?.find((a) => a.id === selectedBusForDetails)?.destination || ''),
            from: t('Addis Ababa'),
            to: t(arrivals?.find((a) => a.id === selectedBusForDetails)?.destination || ''),
            estimatedArrival:
              arrivals?.find((a) => a.id === selectedBusForDetails)?.minutes_away || 0,
            departureTime:
              arrivals?.find((a) => a.id === selectedBusForDetails)?.arrival_time || '',
            capacity: 45,
            currentOccupancy: 20,
            price: 35,
            rating: 4.8,
            amenities: ['wifi', 'ac', 'charging'],
            accessibility: arrivals?.find((a) => a.id === selectedBusForDetails)?.accessible || false,
            busType: 'standard',
            driverInfo: {
              name: t('Driver'),
              rating: 4.8,
              experience: t('5 years'),
            },
            routeStops: [t('Station 1'), t('Station 2'), t('Station 3')],
            nextStops: [{ name: t('Stop 1'), eta: t('{0} min', 5) }],
          }}
          onClose={handleCloseDetails}
          onBookTicket={handleBookFromDetails}
        />
      )}
    </div>
  );
}
