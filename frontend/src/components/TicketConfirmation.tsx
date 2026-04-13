import { Check, QrCode, MapPin, Clock, Download, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface TicketConfirmationProps {
  ticketId: string;
  onNewBooking: () => void;
}

export function TicketConfirmation({ ticketId, onNewBooking }: TicketConfirmationProps) {
  // Mock ticket details with seat information
  const ticketDetails = {
    id: ticketId,
    routeNumber: 'AA-01',
    destination: 'Bole Airport',
    boardingStop: 'Meskel Square Station',
    validUntil: '3:15 PM',
    fareType: 'Adult',
    price: '15 ETB',
    date: new Date().toLocaleDateString(),
    seatNumbers: ['3A'], // This would come from the booking flow
    quantity: 1,
    busNumber: 'AA-001',
    departureTime: '2:15 PM',
    estimatedArrival: '2:50 PM',
    paymentMethod: 'Mobile Money',
    confirmationCode: 'SMB' + Math.random().toString(36).substr(2, 6).toUpperCase(),
  };

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
        {/* Ticket Details */}
        <Card className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">SmartBus Ticket - Ethiopia 🇪🇹</h3>
              <p className="text-sm text-muted-foreground">#{ticketDetails.id}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Confirmed
            </Badge>
          </div>

          {/* Route and Seat Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-lg px-2 py-1">
                  <span className="text-sm font-medium">{ticketDetails.routeNumber}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{ticketDetails.boardingStop}</p>
                  <p className="text-xs text-muted-foreground">↓</p>
                  <p className="text-sm font-medium">{ticketDetails.destination}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    Seat {ticketDetails.seatNumbers.join(', ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bus {ticketDetails.busNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Departure</p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{ticketDetails.departureTime}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrival</p>
              <p className="font-medium">{ticketDetails.estimatedArrival}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fare Type</p>
              <p className="font-medium">{ticketDetails.fareType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium">{ticketDetails.price}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{ticketDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Date</p>
              <p className="font-medium">{ticketDetails.date}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-muted rounded-lg p-6 text-center">
            <div className="bg-white rounded-lg p-4 inline-block mb-3">
              <QrCode className="w-20 h-20 text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Show this QR code to the conductor
            </p>
            <p className="text-xs text-muted-foreground">
              Confirmation: {ticketDetails.confirmationCode}
            </p>
          </div>
        </Card>

        {/* Important Information */}
        <Card className="p-4">
          <h4 className="font-medium mb-2">Important Information</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Please arrive at the boarding station 10 minutes before departure</p>
            <p>• Your seat {ticketDetails.seatNumbers.join(', ')} is reserved for this journey</p>
            <p>• Present this QR code to the conductor when boarding</p>
            <p>• Keep your ticket until the end of your journey</p>
            <p>• Cancellation allowed up to 1 hour before departure</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Save Ticket
          </Button>
          <Button className="flex-1" onClick={onNewBooking}>
            Book Another
          </Button>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact SmartBus support at support@smartbus.et or call 8888
          </p>
        </div>

        {/* Ethiopian Transit Branding */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            🇪🇹 Ethiopian Smart Transit System • Powered by SmartBus
          </p>
        </div>
      </div>
    </div>
  );
}