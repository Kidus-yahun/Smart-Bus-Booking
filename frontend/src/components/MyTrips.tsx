import { useState } from 'react';
import { ArrowLeft, Bus, Clock, MapPin, Calendar, MoreVertical, Download, Share2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface MyTripsProps {
  onBack: () => void;
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  busNumber: string;
  seat: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  rating?: number;
}

export function MyTrips({ onBack }: MyTripsProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Mock data - in a real app this would come from an API
  const trips: Trip[] = [
    {
      id: '1',
      from: 'Bole (Megenagna)',
      to: 'Piazza',
      date: '2024-12-20',
      time: '14:30',
      busNumber: 'SB-001',
      seat: 'A12',
      price: 15,
      status: 'active'
    },
    {
      id: '2',
      from: 'Kazanchis',
      to: 'CMC',
      date: '2024-12-18',
      time: '09:15',
      busNumber: 'SB-045',
      seat: 'B08',
      price: 12,
      status: 'completed',
      rating: 5
    },
    {
      id: '3',
      from: '6 Kilo',
      to: 'Merkato',
      date: '2024-12-15',
      time: '16:45',
      busNumber: 'SB-023',
      seat: 'C05',
      price: 18,
      status: 'completed',
      rating: 4
    },
    {
      id: '4',
      from: 'Arat Kilo',
      to: 'Bole Airport',
      date: '2024-12-10',
      time: '11:20',
      busNumber: 'SB-067',
      seat: 'A15',
      price: 25,
      status: 'completed',
      rating: 5
    }
  ];

  const activeTrips = trips.filter(trip => trip.status === 'active');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-primary" />
          <span className="font-medium">{trip.busNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{trip.from}</span>
          </div>
          <div className="text-xs text-muted-foreground">→</div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{trip.to}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(trip.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{trip.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Seat: </span>
            <span className="font-medium">{trip.seat}</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{trip.price} ETB</div>
            {trip.rating && trip.status === 'completed' && (
              <div className="flex items-center gap-1 mt-1">
                {renderStars(trip.rating)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">My Trips</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active ({activeTrips.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTrips.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {activeTrips.length > 0 ? (
              activeTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">No Active Trips</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any active trips. Book a ticket to get started!
                </p>
                <Button className="mt-4" onClick={onBack}>
                  Book a Trip
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedTrips.length > 0 ? (
              completedTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">No Trip History</h3>
                <p className="text-sm text-muted-foreground">
                  Your completed trips will appear here.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        {completedTrips.length > 0 && (
          <Card className="p-4 mt-6">
            <h3 className="font-medium mb-4">Trip Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-medium text-primary">{completedTrips.length}</div>
                <div className="text-xs text-muted-foreground">Total Trips</div>
              </div>
              <div>
                <div className="text-xl font-medium text-primary">
                  {completedTrips.reduce((sum, trip) => sum + trip.price, 0)} ETB
                </div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
              <div>
                <div className="text-xl font-medium text-primary">
                  {(completedTrips.reduce((sum, trip) => sum + (trip.rating || 0), 0) / completedTrips.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}