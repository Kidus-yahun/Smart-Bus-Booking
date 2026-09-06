import {
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
import type * as React from 'react';

import { useState } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack: _onBack }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    busUpdates: true,
    promotions: false,
  });

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
    <div className="min-h-screen bg-background p-4 space-y-6">
      <h2 className="text-xl font-semibold">{t('Settings')}</h2>

      {/* Appearance */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="font-medium">{t('Appearance')}</h2>
        </div>
        <SettingsItem
          icon={theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          title={t('Theme')}
          description={t('Currently using {0} mode', theme)}
        >
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </SettingsItem>
        <SettingsItem
          icon={<Globe className="w-5 h-5" />}
          title={t('Language')}
          description={t('Choose your preferred language')}
        >
          <Select value={language} onValueChange={(v) => setLanguage(v as 'en' | 'am')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('English')}</SelectItem>
              <SelectItem value="am">{t('አማርኛ (Amharic)')}</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="font-medium">{t('Notifications')}</h2>
        </div>
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title={t('Push Notifications')}
          description={t('Receive notifications on your device')}
        >
          <Switch
            checked={notifications.push}
            onCheckedChange={() => handleNotificationChange('push')}
          />
        </SettingsItem>
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title={t('Email Notifications')}
          description={t('Receive booking confirmations via email')}
        >
          <Switch
            checked={notifications.email}
            onCheckedChange={() => handleNotificationChange('email')}
          />
        </SettingsItem>
        <SettingsItem
          icon={<Phone className="w-5 h-5" />}
          title={t('SMS Notifications')}
          description={t('Receive SMS updates about your trips')}
        >
          <Switch
            checked={notifications.sms}
            onCheckedChange={() => handleNotificationChange('sms')}
          />
        </SettingsItem>
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title={t('Bus Updates')}
          description={t('Get real-time bus location updates')}
        >
          <Switch
            checked={notifications.busUpdates}
            onCheckedChange={() => handleNotificationChange('busUpdates')}
          />
        </SettingsItem>
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title={t('Promotions')}
          description={t('Receive offers and promotional content')}
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
          <h2 className="font-medium">{t('Privacy & Security')}</h2>
        </div>
        <SettingsItem
          icon={<Shield className="w-5 h-5" />}
          title={t('Privacy Policy')}
          description={t('View our privacy policy')}
          onClick={() => {}}
        />
        <SettingsItem
          icon={<Shield className="w-5 h-5" />}
          title={t('Terms of Service')}
          description={t('View terms and conditions')}
          onClick={() => {}}
        />
        <SettingsItem
          icon={<Shield className="w-5 h-5" />}
          title={t('Data & Storage')}
          description={t('Manage your data preferences')}
          onClick={() => {}}
        />
      </Card>

      {/* Support */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="font-medium">{t('Support')}</h2>
        </div>
        <SettingsItem
          icon={<HelpCircle className="w-5 h-5" />}
          title={t('Help Center')}
          description={t('Get help with using SmartBus')}
          onClick={() => {}}
        />
        <SettingsItem
          icon={<Phone className="w-5 h-5" />}
          title={t('Contact Support')}
          description={t('Reach out to our support team')}
          onClick={() => {}}
        />
        <SettingsItem
          icon={<Info className="w-5 h-5" />}
          title={t('About SmartBus')}
          description={t('Version 1.0.0')}
          onClick={() => {}}
        />
      </Card>

      {/* Ethiopian Localization */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="font-medium">{t('Ethiopian Features')}</h2>
        </div>
        <SettingsItem
          icon={<Globe className="w-5 h-5" />}
          title={t('Ethiopian Calendar')}
          description={t('Show dates in Ethiopian calendar')}
        >
          <Switch defaultChecked={false} />
        </SettingsItem>
        <SettingsItem
          icon={<Globe className="w-5 h-5" />}
          title={t('Local Time Format')}
          description={t('Use Ethiopian time format')}
        >
          <Switch defaultChecked={false} />
        </SettingsItem>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>{t('SmartBus Ethiopia v1.0.0')}</p>
        <p>{t('Made with ❤️ in Addis Ababa')}</p>
      </div>
    </div>
  );
}
