import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { BottomNav } from './components/BottomNav';
import { BusArrivalsList } from './components/BusArrivalsList';
import { Header } from './components/Header';
import { MapBottomSheet } from './components/MapBottomSheet';
import { MapCard } from './components/MapCard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useUserLocation } from './hooks/useUserLocation';
import { Booking } from './pages/Booking';
import { Confirmation } from './pages/Confirmation';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Trips } from './pages/Trips';

import './styles/mobile.css';

type AppState = 'home' | 'booking' | 'confirmation' | 'profile' | 'trips' | 'settings';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  stiffness: 300,
  damping: 30,
};

function MainApp() {
  const { user } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const { location: userLocation } = useUserLocation();

  const handleSelectBus = (busId: string, destinationStationId?: number, boardingStationId?: number) => {
    setSelectedBusId(busId);
    // Store pre-selected stations for booking
    if (destinationStationId && boardingStationId) {
      localStorage.setItem('preSelectedDestination', destinationStationId.toString());
      localStorage.setItem('preSelectedBoarding', boardingStationId.toString());
    }
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

  const handleNavigate = (screen: 'home' | 'trips' | 'profile' | 'settings') => {
    setCurrentState(screen);
  };

  const renderPage = () => {
    switch (currentState) {
      case 'profile':
        return <Profile onBack={() => {}} />;
      case 'trips':
        return <Trips onBack={() => setCurrentState('home')} />;
      case 'settings':
        return <Settings onBack={() => {}} />;
      case 'booking':
        return selectedBusId ? (
          <Booking
            busId={selectedBusId}
            onBack={handleBackToHome}
            onBookingComplete={handleBookingComplete}
          />
        ) : null;
      case 'confirmation':
        return ticketId ? (
          <Confirmation ticketId={ticketId} onNewBooking={handleNewBooking} />
        ) : null;
      case 'home':
        return (
          <>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <h2 className="font-medium mb-1">Welcome back, {user?.name.split(' ')[0] || 'User'}! 👋</h2>
              <p className="text-sm text-muted-foreground">Ready to book your next bus journey?</p>
            </div>
            <MapCard onOpenMap={() => setShowMap(true)} userLocation={userLocation} />
            <BusArrivalsList onSelectBus={handleSelectBus} />
            <MapBottomSheet
              open={showMap}
              onClose={() => setShowMap(false)}
              userLocation={userLocation}
            />
          </>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <AuthWrapper />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top pb-16">
      <div className="status-bar-spacer"></div>
      <Header onNavigate={(screen) => setCurrentState(screen)} />

      <div className="mobile-container mx-auto px-4 py-2 max-w-md space-y-4 mobile-scroll pb-32 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentState}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav
        currentScreen={
          currentState === 'settings' ? 'settings' : currentState === 'trips' ? 'trips' : 'home'
        }
        onNavigate={handleNavigate}
      />
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
