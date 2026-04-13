import { useState } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Booking } from './pages/Booking';
import { Confirmation } from './pages/Confirmation';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Trips } from './pages/Trips';

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <AuthWrapper />
      </div>
    );
  }

  if (currentState === 'profile') {
    return <Profile onBack={handleBackFromScreen} />;
  }

  if (currentState === 'trips') {
    return <Trips onBack={handleBackFromScreen} />;
  }

  if (currentState === 'settings') {
    return <Settings onBack={handleBackFromScreen} />;
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      <div className="status-bar-spacer"></div>
      <Header onNavigate={handleNavigate} />

      <div className="mobile-container mx-auto p-4 max-w-md space-y-6 mobile-scroll">
        {currentState === 'home' && (
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="font-medium mb-1">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-sm text-muted-foreground">Ready to book your next bus journey?</p>
          </div>
        )}

        {currentState === 'home' && <Home onSelectBus={handleSelectBus} />}

        {currentState === 'booking' && selectedBusId && (
          <Booking
            busId={selectedBusId}
            onBack={handleBackToHome}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {currentState === 'confirmation' && ticketId && (
          <Confirmation ticketId={ticketId} onNewBooking={handleNewBooking} />
        )}
      </div>

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
