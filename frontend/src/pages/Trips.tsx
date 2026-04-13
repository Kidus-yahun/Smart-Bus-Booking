import { useQuery } from '@tanstack/react-query';
import { Bus, Download, Loader2, MoreVertical, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { useRef, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ticketsApi } from '../lib/api';

interface TripsProps {
  onBack: () => void;
}

export function Trips({ onBack }: TripsProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myTickets'],
    queryFn: () => ticketsApi.getMyTickets(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'used':
        return <Badge className="bg-blue-500">Used</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeTickets =
    tickets?.filter((t) => t.status === 'pending' || t.status === 'confirmed') || [];
  const completedTickets =
    tickets?.filter((t) => t.status === 'used' || t.status === 'cancelled') || [];

  const displayTickets = activeTab === 'active' ? activeTickets : completedTickets;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">Failed to load tickets. Please try again.</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Trips</h2>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Active ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            History ({completedTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {displayTickets.length > 0 ? (
            displayTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.ticket_number}</span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(ticket.travel_date)} at {formatTime(ticket.travel_date)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download Ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <p className="text-muted-foreground">Fare Type</p>
                    <p className="font-medium capitalize">{ticket.fare_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{ticket.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Price</p>
                    <p className="font-medium">{ticket.total_price_etb} ETB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Booked</p>
                    <p className="font-medium">{formatDate(ticket.booking_time)}</p>
                  </div>
                </div>

                {ticket.qr_code && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">QR Code</p>
                    <div className="flex justify-center">
                      <canvas
                        className="w-24 h-24"
                        ref={(canvas) => {
                          if (canvas && ticket.qr_code) {
                            QRCode.toCanvas(canvas, ticket.qr_code, {
                              width: 96,
                              margin: 1,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Bus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No active trips</p>
              <Button className="mt-4" onClick={onBack}>
                Book a Trip
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {displayTickets.length > 0 ? (
            displayTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.ticket_number}</span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(ticket.travel_date)}
                    </p>
                  </div>
                  <p className="font-medium">{ticket.total_price_etb} ETB</p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No trip history</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
