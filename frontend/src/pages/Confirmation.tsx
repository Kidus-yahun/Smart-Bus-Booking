import { useQuery } from '@tanstack/react-query';
import { Check, Clock, Download, Loader2, MapPin, QrCode, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ticketsApi } from '../lib/api';

interface ConfirmationProps {
  ticketId: string;
  onNewBooking: () => void;
}

export function Confirmation({ ticketId, onNewBooking }: ConfirmationProps) {
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsApi.getTicket(parseInt(ticketId, 10)),
    enabled: !!ticketId && ticketId !== 'demo',
  });

  const _formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const ticketDetails = ticket || {
    route_number: 'AA-01',
    destination: 'Bole Airport',
    boardingStop: 'Meskel Square Station',
    fare_type: 'Adult',
    price_etb: 15,
    seat_numbers: ['3A'],
    quantity: 1,
    bus_number: 'AA-001',
    departure_time: new Date().toISOString(),
    arrival_time: new Date().toISOString(),
    payment_method: 'Mobile Money',
    ticket_number: ticketId,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-fit mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="font-medium text-lg mb-2">Ticket Purchased!</h2>
        <p className="text-muted-foreground">
          Your bus ticket is ready. Show the QR code to the driver when boarding.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">SmartBus Ticket</h3>
              <p className="text-sm text-muted-foreground">
                #{ticketDetails.ticket_number || ticketId}
              </p>
            </div>
            <Badge className="bg-green-500">Confirmed</Badge>
          </div>

          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-lg">
              <canvas
                ref={(canvas) => {
                  if (canvas) {
                    QRCode.toCanvas(canvas, ticketDetails.ticket_number || ticketId, {
                      width: 128,
                      margin: 2,
                    });
                  }
                }}
              />
              <p className="text-xs text-center mt-2 font-mono">
                {ticketDetails.ticket_number || ticketId}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">Trip Details</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{ticketDetails.boardingStop || 'boarding_station'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{ticketDetails.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="font-medium">
                  {ticketDetails.departure_time ? formatTime(ticketDetails.departure_time) : 'TBD'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Seats</p>
                <p className="font-medium">
                  {ticketDetails.seat_numbers ? ticketDetails.seat_numbers.join(', ') : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fare Type</span>
            <span className="font-medium capitalize">{ticketDetails.fare_type}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">{ticketDetails.quantity}</span>
          </div>
          <div className="flex justify-between text-sm mt-2 pt-2 border-t">
            <span className="font-medium">Total</span>
            <span className="font-medium">{ticketDetails.price_etb} ETB</span>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={onNewBooking} className="flex-1">
            Book Another
          </Button>
        </div>
      </div>
    </div>
  );
}
