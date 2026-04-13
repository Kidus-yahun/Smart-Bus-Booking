import { useState, useEffect } from 'react';
import { ArrowLeft, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'reserved';

export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
  row: number;
  column: 'A' | 'B' | 'C' | 'D'; // A,B = left side, C,D = right side
}

interface SeatSelectionProps {
  busId: string;
  scheduleId: string;
  requiredSeats: number;
  onSeatsSelected: (selectedSeats: string[]) => void;
  onBack: () => void;
}

export function SeatSelection({
  busId,
  scheduleId,
  requiredSeats,
  onSeatsSelected,
  onBack
}: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'seat-plan' | 'info' | 'review'>('seat-plan');
  const [isLoading, setIsLoading] = useState(true);

  // Get route and bus info based on busId
  const busInfo = {
    '1': { route: 'AA-01', origin: 'Meskel Square', destination: 'Bole Airport', date: '12 Sept 2023', capacity: 48, features: ['AC', 'WiFi', 'USB'] },
    '2': { route: 'AA-05', origin: 'Merkato', destination: 'Piazza', date: '12 Sept 2023', capacity: 36, features: ['AC', 'WiFi'] },
    '3': { route: 'AA-12', origin: 'AAU', destination: 'Stadium', date: '12 Sept 2023', capacity: 44, features: ['AC'] },
  }[busId] || { route: 'AA-01', origin: 'Meskel Square', destination: 'Bole Airport', date: '12 Sept 2023', capacity: 48, features: ['AC', 'WiFi', 'USB'] };

  // Load seat data (simulated API call)
  useEffect(() => {
    const loadSeatData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate realistic seat layout
      const seatLayout: Seat[] = [];
      const totalRows = Math.ceil(busInfo.capacity / 4); // 4 seats per row
      
      for (let row = 1; row <= totalRows; row++) {
        for (const position of ['A', 'B', 'C', 'D'] as const) {
          // Skip some seats at the back for smaller buses
          if (row * 4 + ['A', 'B', 'C', 'D'].indexOf(position) >= busInfo.capacity) {
            continue;
          }
          
          const seatNumber = `${row}${position}`;
          let status: SeatStatus = 'available';
          
          // Simulate some occupied seats (more realistic distribution)
          if (Math.random() > 0.75) {
            status = 'occupied';
          } else if (Math.random() > 0.95) {
            status = 'reserved';
          }
          
          seatLayout.push({
            id: seatNumber,
            number: seatNumber,
            status,
            row,
            column: position
          });
        }
      }
      
      setSeats(seatLayout);
      setIsLoading(false);
    };

    loadSeatData();
  }, [busId, scheduleId, busInfo.capacity]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'occupied' || seat.status === 'reserved') {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        // Deselect seat
        return prev.filter(id => id !== seatId);
      } else if (prev.length < requiredSeats) {
        // Select seat if we haven't reached the limit
        return [...prev, seatId];
      } else {
        // Replace the first selected seat with new selection
        return [...prev.slice(1), seatId];
      }
    });
  };

  const getSeatIcon = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    
    let bgColor = 'bg-gray-100 border-2 border-gray-300'; // available
    let textColor = 'text-gray-600';
    
    if (seat.status === 'occupied') {
      bgColor = 'bg-red-500 border-red-500';
      textColor = 'text-white';
    } else if (seat.status === 'reserved') {
      bgColor = 'bg-orange-500 border-orange-500';
      textColor = 'text-white';
    } else if (isSelected) {
      bgColor = 'bg-green-500 border-green-500';
      textColor = 'text-white';
    }

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat.id)}
        disabled={seat.status === 'occupied' || seat.status === 'reserved'}
        className={`
          w-8 h-10 rounded-md text-xs font-medium transition-all duration-200
          ${bgColor} ${textColor}
          ${seat.status === 'available' || isSelected ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-75'}
          ${isSelected ? 'ring-2 ring-green-400 ring-offset-1' : ''}
        `}
      >
        {seat.row}
      </button>
    );
  };

  const renderSeatMap = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg p-4 max-h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading seat map...</p>
          </div>
        </div>
      );
    }

    const maxRow = Math.max(...seats.map(s => s.row));
    const rows = Array.from({ length: maxRow }, (_, i) => i + 1);
    
    return (
      <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
        {/* Driver area */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
            <Car className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        {/* Seat layout */}
        <div className="space-y-3">
          {rows.map(row => {
            const rowSeats = seats.filter(s => s.row === row);
            const leftSeats = rowSeats.filter(s => s.column === 'A' || s.column === 'B');
            const rightSeats = rowSeats.filter(s => s.column === 'C' || s.column === 'D');
            
            return (
              <div key={row} className="flex items-center justify-between">
                {/* Left side seats */}
                <div className="flex gap-1">
                  {leftSeats.map(seat => getSeatIcon(seat))}
                </div>
                
                {/* Aisle with row number */}
                <div className="w-8 flex items-center justify-center text-xs text-muted-foreground">
                  {row}
                </div>
                
                {/* Right side seats */}
                <div className="flex gap-1">
                  {rightSeats.map(seat => getSeatIcon(seat))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInfo = () => (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-2">Bus Information</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Route Number: {busInfo.route}</p>
          <p>• Total Seats: {busInfo.capacity}</p>
          <p>• Available Seats: {seats.filter(s => s.status === 'available').length}</p>
          <p>• Features: {busInfo.features.join(', ')}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Route Information</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Origin: {busInfo.origin}</p>
          <p>• Destination: {busInfo.destination}</p>
          <p>• Distance: 8.5 km</p>
          <p>• Estimated Duration: 35 minutes</p>
          <p>• Date: {busInfo.date}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Boarding Rules</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Please arrive 10 minutes before departure</p>
          <p>• Show QR code to conductor when boarding</p>
          <p>• Seat assignment is mandatory</p>
          <p>• No smoking or loud music allowed</p>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-2">Selected Seats</h3>
        {selectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seatId => (
              <Badge key={seatId} variant="secondary" className="bg-green-100 text-green-800">
                Seat {seatId}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No seats selected</p>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Route:</span>
            <span>{busInfo.route}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected Seats:</span>
            <span>{selectedSeats.length} of {requiredSeats}</span>
          </div>
          <div className="flex justify-between">
            <span>Seat Numbers:</span>
            <span>{selectedSeats.join(', ') || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span>Travel Date:</span>
            <span>{busInfo.date}</span>
          </div>
        </div>
      </div>

      {selectedSeats.length === requiredSeats && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✅ Perfect! You have selected all {requiredSeats} required seats.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Select Seat(s)</h1>
          <p className="text-sm text-muted-foreground">
            {seats.filter(s => s.status === 'available').length} • {busInfo.capacity}
          </p>
        </div>
      </div>

      {/* Route Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">SmartBus</span>
            <Badge variant="outline">{busInfo.route}</Badge>
          </div>
          <Badge variant="outline">🇪🇹</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{busInfo.origin.toUpperCase()}</span>
          <span>→</span>
          <span>{busInfo.destination.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">📅 {busInfo.date}</span>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('seat-plan')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'seat-plan' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Seat plan
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'info' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'review' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Review
        </button>
      </div>

      {/* Seat Legend */}
      {activeTab === 'seat-plan' && !isLoading && (
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-5 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-5 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-5 bg-green-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-5 bg-orange-500 rounded"></div>
            <span>Reserved</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'seat-plan' && renderSeatMap()}
        {activeTab === 'info' && renderInfo()}
        {activeTab === 'review' && renderReview()}
      </div>

      {/* Continue Button */}
      <div className="sticky bottom-0 bg-background pt-4 border-t">
        <Button 
          className="w-full" 
          size="lg"
          disabled={selectedSeats.length !== requiredSeats}
          onClick={() => onSeatsSelected(selectedSeats)}
        >
          {selectedSeats.length === 0 ? (
            `Select ${requiredSeats} seat${requiredSeats !== 1 ? 's' : ''} to continue`
          ) : selectedSeats.length < requiredSeats ? (
            `Select ${requiredSeats - selectedSeats.length} more seat${requiredSeats - selectedSeats.length !== 1 ? 's' : ''}`
          ) : (
            `Continue with seats ${selectedSeats.join(', ')}`
          )}
        </Button>
      </div>
    </div>
  );
}