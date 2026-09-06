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
import { useLanguage } from '../contexts/LanguageContext';
import { capitalize } from '../i18n/translations';

interface TripsProps {
  onBack: () => void;
}

export function Trips({ onBack }: TripsProps) {
  const { t, formatDate, formatTime } = useLanguage();
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
        return <Badge className="bg-yellow-500">{t('Pending')}</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">{t('Confirmed')}</Badge>;
      case 'used':
        return <Badge className="bg-blue-500">{t('Used')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{t('Cancelled')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
        <p className="text-red-500">{t('Failed to load tickets. Please try again.')}</p>
        <Button onClick={onBack} className="mt-4">
          {t('Go Back')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('My Trips')}</h2>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            {t('Active ({0})', activeTickets.length)}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            {t('History ({0})', completedTickets.length)}
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
                      {t('{0} at {1}', formatDate(ticket.travel_date), formatTime(ticket.travel_date))}
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
                        {t('Download Ticket')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('Share')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <p className="text-muted-foreground">{t('Fare Type')}</p>
                    <p className="font-medium capitalize">{t(capitalize(ticket.fare_type))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('Quantity')}</p>
                    <p className="font-medium">{ticket.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('Total Price')}</p>
                    <p className="font-medium">{t('{0} ETB', ticket.total_price_etb)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('Booked')}</p>
                    <p className="font-medium">{formatDate(ticket.booking_time)}</p>
                  </div>
                </div>

                {ticket.qr_code && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">{t('QR Code')}</p>
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
              <p className="text-muted-foreground">{t('No active trips')}</p>
              <Button className="mt-4" onClick={onBack}>
                {t('Book a Trip')}
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
                  <p className="font-medium">{t('{0} ETB', ticket.total_price_etb)}</p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t('No trip history')}</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
