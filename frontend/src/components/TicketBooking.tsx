import { ArrowLeft, CreditCard, Users, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { SeatSelection } from './SeatSelection';

interface TicketBookingProps {
  busId: string;
  onBack: () => void;
  onBookingComplete: (ticketId: string) => void;
}

type BookingStep = 'fare-selection' | 'seat-selection' | 'payment-processing';

const fareTypes = [
  { id: 'adult', name: 'Adult', price: 15, description: 'Standard fare' },
  { id: 'senior', name: 'Senior (65+)', price: 8, description: '50% discount' },
  { id: 'student', name: 'Student', price: 10, description: 'With valid ID' },
  { id: 'child', name: 'Child (5-12)', price: 5, description: 'Under 5 ride free' },
];

// Map bus IDs to Ethiopian route information
const busRouteMap: { [key: string]: any } = {
  '1': {
    routeNumber: 'AA-01',
    destination: 'Bole Airport',
    arrivalTime: '2:15 PM',
    minutesAway: 3,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-001',
  },
  '2': {
    routeNumber: 'AA-05',
    destination: 'Merkato',
    arrivalTime: '2:18 PM',
    minutesAway: 6,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-002',
  },
  '3': {
    routeNumber: 'AA-12',
    destination: 'Addis Ababa University',
    arrivalTime: '2:22 PM',
    minutesAway: 10,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-003',
  },
  '4': {
    routeNumber: 'AA-03',
    destination: 'Piazza',
    arrivalTime: '2:25 PM',
    minutesAway: 13,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-004',
  },
  '5': {
    routeNumber: 'AA-07',
    destination: 'CMC (Cherkos)',
    arrivalTime: '2:35 PM',
    minutesAway: 23,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-005',
  },
};

export function TicketBooking({ busId, onBack, onBookingComplete }: TicketBookingProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('fare-selection');
  const [selectedFare, setSelectedFare] = useState<string>('adult');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get bus details based on busId
  const busDetails = busRouteMap[busId] || {
    routeNumber: 'AA-01',
    destination: 'Bole Airport',
    arrivalTime: '2:15 PM',
    minutesAway: 3,
    currentStop: 'Meskel Square Station',
    scheduleId: 'SCH-001',
  };

  const selectedFareType = fareTypes.find(fare => fare.id === selectedFare)!;
  const totalPrice = selectedFareType.price * quantity;

  const handleProceedToSeatSelection = () => {
    setCurrentStep('seat-selection');
  };

  const handleSeatsSelected = (seats: string[]) => {
    setSelectedSeats(seats);
    setCurrentStep('payment-processing');
  };

  const handleBackToFareSelection = () => {
    setCurrentStep('fare-selection');
  };

  const handleBookTicket = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ticketId = `TKT-${Date.now()}`;
    onBookingComplete(ticketId);
    setIsProcessing(false);
  };

  // Render seat selection step
  if (currentStep === 'seat-selection') {
    return (
      <SeatSelection
        busId={busId}
        scheduleId={busDetails.scheduleId}
        requiredSeats={quantity}
        onSeatsSelected={handleSeatsSelected}
        onBack={handleBackToFareSelection}
      />
    );
  }

  // Render fare selection and payment processing steps
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-medium">
            {currentStep === 'fare-selection' ? 'Book Ticket' : 'Confirm Payment'}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Bus Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2">
                <span className="font-medium text-lg">{busDetails.routeNumber}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{busDetails.destination}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Arrives at {busDetails.arrivalTime}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {busDetails.currentStop}
                </p>
              </div>
            </div>
            <Badge variant="secondary">
              {busDetails.minutesAway} min
            </Badge>
          </div>
        </Card>

        {/* Show selected seats if in payment step */}
        {currentStep === 'payment-processing' && selectedSeats.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium mb-2">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seatId => (
                <Badge key={seatId} variant="secondary" className="bg-green-100 text-green-800">
                  Seat {seatId}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Fare Selection - Always visible for reference */}
        <div className="space-y-4">
          <h3 className="font-medium">
            {currentStep === 'fare-selection' ? 'Select Fare Type' : 'Selected Fare'}
          </h3>
          {currentStep === 'fare-selection' ? (
            <div className="grid grid-cols-1 gap-3">
              {fareTypes.map((fare) => (
                <button
                  key={fare.id}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedFare === fare.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedFare(fare.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{fare.name}</span>
                      <p className="text-sm text-muted-foreground">{fare.description}</p>
                    </div>
                    <span className="font-medium">{fare.price} ETB</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{selectedFareType.name}</span>
                  <p className="text-sm text-muted-foreground">{selectedFareType.description}</p>
                </div>
                <span className="font-medium">{selectedFareType.price} ETB</span>
              </div>
            </Card>
          )}
        </div>

        {/* Quantity Selection - Only in fare selection step */}
        {currentStep === 'fare-selection' && (
          <div className="space-y-2">
            <label className="font-medium">Quantity</label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'ticket' : 'tickets'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Total */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Total</span>
              <p className="text-sm text-muted-foreground">
                {quantity} × {selectedFareType.name}
                {selectedSeats.length > 0 && ` • Seats: ${selectedSeats.join(', ')}`}
              </p>
            </div>
            <span className="text-xl font-medium">{totalPrice} ETB</span>
          </div>
        </div>

        {/* Action Button */}
        {currentStep === 'fare-selection' ? (
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleProceedToSeatSelection}
          >
            <Users className="w-5 h-5" />
            Select Seats
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleBookTicket}
            disabled={isProcessing}
          >
            <CreditCard className="w-5 h-5" />
            {isProcessing ? 'Processing...' : `Pay ${totalPrice} ETB`}
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {currentStep === 'fare-selection' 
            ? 'You will select your seats in the next step before payment.'
            : 'Your ticket will be available immediately after payment. Show QR code to driver. Payment accepted: Mobile Money, Credit/Debit Cards, and CBE Birr.'
          }
        </p>
      </div>
    </div>
  );
}