import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/bus_arrival_model.dart';
import '../../../data/providers/auth_provider.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/translations.dart';
import '../booking/booking_screen.dart';
import 'bus_arrivals_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<BusArrivalModel> _arrivals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadArrivals();
  }

  Future<void> _loadArrivals() async {
    final arrivals = await ApiService.getUpcomingArrivals();
    if (mounted) {
      setState(() {
        _arrivals = arrivals;
        _isLoading = false;
      });
    }
  }

  void _onSelectBus(BusArrivalModel bus) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BookingScreen(
          busId: bus.id,
          initialDestinationId: bus.destinationStationId,
          initialBoardingId: bus.originStationId,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;
    final user = Provider.of<AuthProvider>(context).user;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppTranslations.translate(
                    'Welcome back, {0}! 👋',
                    lang,
                    [user?.fullName.split(' ')[0] ?? 'User'],
                  ),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
                const SizedBox(height: 4),
                Text(
                  AppTranslations.translate('Ready to book your next bus journey?', lang),
                  style: const TextStyle(fontSize: 13, color: Colors.grey),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Map Card Widget
          Container(
            height: 140,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.blue[900],
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.navigation, color: Colors.white, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          AppTranslations.translate('Track Nearby Buses', lang),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      ),
                      onPressed: () {},
                      child: Text(AppTranslations.translate('Open', lang)),
                    ),
                  ],
                ),
                Text(
                  AppTranslations.translate('Live location enabled', lang),
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Bus Arrivals
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : BusArrivalsList(
                  arrivals: _arrivals,
                  onSelectBus: _onSelectBus,
                ),
        ],
      ),
    );
  }
}
