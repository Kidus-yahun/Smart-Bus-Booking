import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/bus_arrival_model.dart';
import '../../../data/providers/auth_provider.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/theme.dart';
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
  int _selectedFilterIndex = 1; // 15 min bus selected

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

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting Subtitle
          Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Text(
              AppTranslations.translate('Ready to book your next bus journey?', lang),
              style: const TextStyle(fontSize: 13, color: Colors.white70),
            ),
          ),

          // Route Input Card (Matching Design Image: White floating card with Blue & Orange Dots)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                // Origin Row
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.blueAccent, width: 3),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('From', style: TextStyle(color: Colors.grey, fontSize: 11)),
                          Text(
                            AppTranslations.translate('Meskel Square', lang),
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.only(left: 5),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: SizedBox(
                      height: 16,
                      child: VerticalDivider(thickness: 1.5, color: Colors.grey),
                    ),
                  ),
                ),
                // Destination Row
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(
                        color: AppTheme.orangeAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('To', style: TextStyle(color: Colors.grey, fontSize: 11)),
                          Text(
                            AppTranslations.translate('Bole Airport', lang),
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.swap_vert, size: 20, color: Colors.black54),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Transport Mode Duration Filter Pills (Matching Reference Image)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterPill(0, Icons.directions_walk, '9 min', false),
                const SizedBox(width: 10),
                _buildFilterPill(1, Icons.directions_bus, '15 min', true), // Selected Blue
                const SizedBox(width: 10),
                _buildFilterPill(2, Icons.nordic_walking, '30 min', false),
                const SizedBox(width: 10),
                _buildFilterPill(3, Icons.directions_car, '12 min', false),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Bus Arrivals List
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : BusArrivalsList(
                  arrivals: _arrivals,
                  onSelectBus: _onSelectBus,
                ),
          const SizedBox(height: 80), // Padding for bottom navbar
        ],
      ),
    );
  }

  Widget _buildFilterPill(int index, IconData icon, String label, bool isSelected) {
    return GestureDetector(
      onTap: () => setState(() => _selectedFilterIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: _selectedFilterIndex == index ? AppTheme.blueAccent : Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: _selectedFilterIndex == index
                  ? AppTheme.blueAccent.withOpacity(0.3)
                  : Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: _selectedFilterIndex == index ? Colors.white : Colors.grey[600],
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: _selectedFilterIndex == index ? Colors.white : Colors.grey[700],
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
