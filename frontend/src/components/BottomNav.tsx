import { AnimatePresence, motion } from 'framer-motion';
import { Home, Settings, Ticket, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface BottomNavProps {
  currentScreen: 'home' | 'trips' | 'profile' | 'settings';
  onNavigate: (screen: 'home' | 'trips' | 'profile' | 'settings') => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const [_activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Book' },
    { id: 'trips' as const, icon: Ticket, label: 'Trips' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative">
        <motion.div
          className="absolute inset-x-0 bottom-0 h-14 bg-background/80 backdrop-blur-xl border-t border-border"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        <div className="relative flex items-center justify-between px-6 py-2">
          {navItems.map((item, index) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`relative flex flex-col items-center gap-1 h-14 px-3 py-1 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveIndex(index);
                  onNavigate(item.id);
                }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <motion.span
                  className="text-[10px] font-medium"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                    y: isActive ? 0 : 4,
                  }}
                >
                  {item.label}
                </motion.span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
