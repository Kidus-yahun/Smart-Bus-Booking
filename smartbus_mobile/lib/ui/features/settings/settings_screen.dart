import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/providers/theme_provider.dart';
import '../../core/translations.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final lang = langProvider.language;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('Settings', lang)),
      ),
      body: ListView(
        children: [
          // Appearance Section
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              AppTranslations.translate('Appearance', lang),
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ),
          ListTile(
            leading: Icon(themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode),
            title: Text(AppTranslations.translate('Theme', lang)),
            trailing: Switch(
              value: themeProvider.isDarkMode,
              onChanged: (_) => themeProvider.toggleTheme(),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.language),
            title: Text(AppTranslations.translate('Language', lang)),
            subtitle: Text(langProvider.isAmharic ? 'አማርኛ' : 'English'),
            trailing: DropdownButton<String>(
              value: lang,
              underline: const SizedBox(),
              items: [
                DropdownMenuItem(
                  value: 'en',
                  child: Text(AppTranslations.translate('English', lang)),
                ),
                DropdownMenuItem(
                  value: 'am',
                  child: Text(AppTranslations.translate('Amharic', lang)),
                ),
              ],
              onChanged: (val) {
                if (val != null) langProvider.setLanguage(val);
              },
            ),
          ),

          const Divider(),

          // Notifications Section
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              AppTranslations.translate('Notifications', lang),
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ),
          SwitchListTile(
            secondary: const Icon(Icons.notifications_outlined),
            title: const Text('Push Notifications'),
            value: true,
            onChanged: (_) {},
          ),
          SwitchListTile(
            secondary: const Icon(Icons.email_outlined),
            title: const Text('Email Booking Confirmation'),
            value: true,
            onChanged: (_) {},
          ),
        ],
      ),
    );
  }
}
