import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthWrapper } from './components/AuthWrapper';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { BusArrivalsList } from './components/BusArrivalsList';
import { TicketBooking } from './components/TicketBooking';
import { TicketConfirmation } from './components/TicketConfirmation';
import { UserProfile } from './components/UserProfile';
import { MyTrips } from './components/MyTrips';
import { Settings } from './components/Settings';

// Import mobile styles
import './styles/mobile.css';

type AppState = 'home' | 'booking' | 'confirmation' | 'profile' | 'trips' | 'settings';

function MainApp() {
  const { user } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSelectBus = (busId: string) => {
    setSelectedBusId(busId);
    setCurrentState('booking');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setSelectedBusId(null);
  };

  const handleBookingComplete = (newTicketId: string) => {
    setTicketId(newTicketId);
    setCurrentState('confirmation');
  };

  const handleNewBooking = () => {
    setCurrentState('home');
    setSelectedBusId(null);
    setTicketId(null);
  };

  const handleNavigate = (screen: 'profile' | 'trips' | 'settings') => {
    setCurrentState(screen);
  };

  const handleBackFromScreen = () => {
    setCurrentState('home');
  };

  // Show authentication flow if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <AuthWrapper />
      </div>
    );
  }

  // Show different screens based on current state
  if (currentState === 'profile') {
    return <UserProfile onBack={handleBackFromScreen} />;
  }

  if (currentState === 'trips') {
    return <MyTrips onBack={handleBackFromScreen} />;
  }

  if (currentState === 'settings') {
    return <Settings onBack={handleBackFromScreen} />;
  }

  // Show main app if user is authenticated
  return (
    <div className="min-h-screen bg-background safe-area-top">
      <div className="status-bar-spacer"></div>
      <Header onNavigate={handleNavigate} />
      
      <div className="mobile-container mx-auto p-4 max-w-md space-y-6 mobile-scroll">
        {/* Welcome message */}
        {currentState === 'home' && (
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="font-medium mb-1">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Ready to book your next bus journey?
            </p>
          </div>
        )}

        {currentState === 'home' && (
          <>
            <div className="mobile-map">
              <MapView />
            </div>
            <BusArrivalsList onSelectBus={handleSelectBus} />
          </>
        )}
        
        {currentState === 'booking' && selectedBusId && (
          <TicketBooking
            busId={selectedBusId}
            onBack={handleBackToHome}
            onBookingComplete={handleBookingComplete}
          />
        )}
        
        {currentState === 'confirmation' && ticketId && (
          <TicketConfirmation
            ticketId={ticketId}
            onNewBooking={handleNewBooking}
          />
        )}
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-6 safe-area-bottom"></div>
      <div className="keyboard-spacer"></div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}