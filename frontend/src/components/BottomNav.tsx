import { Home, Settings, Ticket } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavProps {
  currentScreen: 'home' | 'trips' | 'profile' | 'settings';
  onNavigate: (screen: 'home' | 'trips' | 'profile' | 'settings') => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Book' },
    { id: 'trips' as const, icon: Ticket, label: 'Trips' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full h-14 bg-background border-t border-border z-50">
      <div className="flex items-center h-full">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center justify-center h-full gap-0 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
