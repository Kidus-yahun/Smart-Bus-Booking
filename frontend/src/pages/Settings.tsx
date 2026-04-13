import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  Moon,
  Phone,
  Shield,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    busUpdates: true,
    promotions: false,
  });
  const [language, setLanguage] = useState('en');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingsItem = ({
    icon,
    title,
    description,
    children,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div
      className={`flex items-center justify-between p-4 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Appearance */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-medium">Appearance</h2>
          </div>
          <SettingsItem
            icon={theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            title="Theme"
            description={`Currently using ${theme} mode`}
          >
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </SettingsItem>
          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            title="Language"
            description="Choose your preferred language"
          >
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                <SelectItem value="or">Oromiffa</SelectItem>
                <SelectItem value="ti">ትግርኛ (Tigrinya)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsItem>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-medium">Notifications</h2>
          </div>
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            title="Push Notifications"
            description="Receive notifications on your device"
          >
            <Switch
              checked={notifications.push}
              onCheckedChange={() => handleNotificationChange('push')}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            title="Email Notifications"
            description="Receive booking confirmations via email"
          >
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Phone className="w-5 h-5" />}
            title="SMS Notifications"
            description="Receive SMS updates about your trips"
          >
            <Switch
              checked={notifications.sms}
              onCheckedChange={() => handleNotificationChange('sms')}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            title="Bus Updates"
            description="Get real-time bus location updates"
          >
            <Switch
              checked={notifications.busUpdates}
              onCheckedChange={() => handleNotificationChange('busUpdates')}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            title="Promotions"
            description="Receive offers and promotional content"
          >
            <Switch
              checked={notifications.promotions}
              onCheckedChange={() => handleNotificationChange('promotions')}
            />
          </SettingsItem>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-medium">Privacy & Security</h2>
          </div>
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            title="Privacy Policy"
            description="View our privacy policy"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            title="Terms of Service"
            description="View terms and conditions"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            title="Data & Storage"
            description="Manage your data preferences"
            onClick={() => {}}
          />
        </Card>

        {/* Support */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-medium">Support</h2>
          </div>
          <SettingsItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help Center"
            description="Get help with using SmartBus"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<Phone className="w-5 h-5" />}
            title="Contact Support"
            description="Reach out to our support team"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<Info className="w-5 h-5" />}
            title="About SmartBus"
            description="Version 1.0.0"
            onClick={() => {}}
          />
        </Card>

        {/* Ethiopian Localization */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-medium">🇪🇹 Ethiopian Features</h2>
          </div>
          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            title="Ethiopian Calendar"
            description="Show dates in Ethiopian calendar"
          >
            <Switch defaultChecked={false} />
          </SettingsItem>
          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            title="Local Time Format"
            description="Use Ethiopian time format"
          >
            <Switch defaultChecked={false} />
          </SettingsItem>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>SmartBus Ethiopia v1.0.0</p>
          <p>Made with ❤️ in Addis Ababa</p>
        </div>
      </div>
    </div>
  );
}
