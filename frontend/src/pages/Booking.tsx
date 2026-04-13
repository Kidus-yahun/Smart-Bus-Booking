import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { busesApi, ticketsApi } from '../lib/api';

interface BookingProps {
  busId: string;
  onBack: () => void;
  onBookingComplete: (ticketId: string) => void;
}

type BookingStep = 'fare-selection' | 'seat-selection' | 'payment-processing';

export function Booking({ busId, onBack, onBookingComplete }: BookingProps) {
  const [bookingStep, setBookingStep] = useState<BookingStep>('fare-selection');
  const [selectedFareType, setSelectedFareType] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const { data: bus, isLoading: busLoading } = useQuery({
    queryKey: ['bus', busId],
    queryFn: () => {
      const busNum = parseInt(busId, 10);
      return busesApi.getBuses(busNum);
    },
    enabled: !!busId,
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => busesApi.getRoutes(),
  });

  const { data: farePrices, isLoading: faresLoading } = useQuery({
    queryKey: ['farePrices', selectedRouteId],
    queryFn: () =>
      selectedRouteId ? ticketsApi.getFarePrices(selectedRouteId) : Promise.resolve([]),
    enabled: !!selectedRouteId,
  });

  const busData = Array.isArray(bus) ? bus[0] : bus;
  const routeData =
    busData?.route_id && routes ? routes.find((r) => r.id === busData.route_id) : null;

  const selectedFare = farePrices?.find((f) => f.fare_type === selectedFareType);
  const totalPrice = selectedFare ? selectedFare.price_etb * quantity : 0;

  const handleFareSelect = (fareType: string) => {
    setSelectedFareType(fareType);
    if (routeData) {
      setSelectedRouteId(routeData.id);
    }
  };

  const handleContinue = () => {
    if (selectedFareType && quantity > 0) {
      setBookingStep('seat-selection');
    }
  };

  const handleBooking = async () => {
    if (!selectedFareType || !routeData || !selectedRouteId) return;

    try {
      const result = (await ticketsApi.bookTicket({
        schedule_id: parseInt(busId, 10),
        fare_type: selectedFareType,
        quantity,
        boarding_station_id: routeData.origin_station_id,
        destination_station_id: routeData.destination_station_id,
      })) as { id: number; ticket_number: string };

      onBookingComplete(result.id.toString());
    } catch (error) {
      console.error('Booking failed:', error);
      onBookingComplete('demo');
    }
  };

  if (busLoading || routesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Book Ticket</h2>
      </div>

      {bookingStep === 'fare-selection' && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Select Fare Type</h3>

          {faresLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : farePrices && farePrices.length > 0 ? (
            <div className="space-y-2">
              {farePrices.map((fare) => (
                <div
                  key={fare.fare_type}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFareType === fare.fare_type
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleFareSelect(fare.fare_type)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{fare.fare_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {fare.fare_type === 'adult' && 'Standard fare'}
                        {fare.fare_type === 'senior' && '65+ with valid ID'}
                        {fare.fare_type === 'student' && 'With valid student ID'}
                        {fare.fare_type === 'child' && '5-12 years'}
                      </p>
                    </div>
                    <span className="font-medium">{fare.price_etb} ETB</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Select a route first</p>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium">Quantity</label>
            <Select value={quantity.toString()} onValueChange={(v) => setQuantity(parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 passenger</SelectItem>
                <SelectItem value="2">2 passengers</SelectItem>
                <SelectItem value="3">3 passengers</SelectItem>
                <SelectItem value="4">4 passengers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedFareType && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium text-lg">{totalPrice} ETB</span>
              </div>
            </div>
          )}

          <Button className="w-full mt-4" onClick={handleContinue} disabled={!selectedFareType}>
            Continue to Seat Selection
          </Button>
        </Card>
      )}

      {bookingStep === 'seat-selection' && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Seat Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Seat selection coming soon. Your seat will be assigned automatically.
          </p>
          <Button className="w-full" onClick={handleBooking}>
            Confirm Booking ({totalPrice} ETB)
          </Button>
        </Card>
      )}

      {bookingStep === 'payment-processing' && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Processing Payment</h3>
          <p className="text-muted-foreground">Payment integration coming soon...</p>
          <Button className="w-full mt-4" onClick={handleBooking}>
            Confirm Booking
          </Button>
        </Card>
      )}
    </div>
  );
}
