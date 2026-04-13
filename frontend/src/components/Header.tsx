import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SmartBusLogo } from './SmartBusLogo';
import { Button } from './ui/button';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <SmartBusLogo size={32} />
          <div>
            <h1 className="font-medium">SmartBus</h1>
            <p className="text-sm text-muted-foreground">Ethiopia</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
