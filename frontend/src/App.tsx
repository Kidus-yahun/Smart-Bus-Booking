import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { BottomNav } from './components/BottomNav';
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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

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

  const handleNavigate = (screen: 'home' | 'trips' | 'profile' | 'settings') => {
    setCurrentState(screen);
  };

  const handleBackFromScreen = () => {
    setCurrentState('home');
  };

  const renderPage = () => {
    switch (currentState) {
      case 'profile':
        return <Profile onBack={() => {}} />;
      case 'trips':
        return <Trips onBack={() => {}} />;
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
      default:
        return <Home onSelectBus={handleSelectBus} />;
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
    <div className="min-h-screen bg-background safe-area-top pb-14">
      <div className="status-bar-spacer"></div>
      <Header onNavigate={(screen) => setCurrentState(screen)} />

      <div className="mobile-container mx-auto px-4 py-2 max-w-md space-y-4 mobile-scroll pb-20">
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
