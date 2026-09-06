import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/providers/auth_provider.dart';
import '../../../data/providers/language_provider.dart';
import '../../core/translations.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('Personal Information', lang)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: Colors.black,
              child: Text(
                user != null && user.fullName.isNotEmpty ? user.fullName[0].toUpperCase() : 'U',
                style: const TextStyle(fontSize: 32, color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 12),

            Text(
              user?.fullName ?? 'User',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Text(
              user?.email ?? 'demo@smartbus.com',
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),

            ListTile(
              leading: const Icon(Icons.person),
              title: Text(AppTranslations.translate('Full Name', lang)),
              subtitle: Text(user?.fullName ?? ''),
            ),
            ListTile(
              leading: const Icon(Icons.phone),
              title: Text(AppTranslations.translate('Phone Number', lang)),
              subtitle: Text(user?.phone ?? '+251-911-234-567'),
            ),
            ListTile(
              leading: const Icon(Icons.location_on),
              title: Text(AppTranslations.translate('Location', lang)),
              subtitle: const Text('Addis Ababa, Ethiopia'),
            ),
            const SizedBox(height: 32),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                onPressed: () {
                  authProvider.logout();
                },
                icon: const Icon(Icons.logout),
                label: const Text('Sign Out'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
