import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

interface HeaderProps {
  onNavigate: (screen: 'profile') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between py-2 max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 px-1"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">
              {user ? getInitials(user.name) : 'U'}
            </span>
          </div>
          <span className="text-sm font-medium">{user?.name.split(' ')[0]}</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
