import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../../data/models/station_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/theme.dart';
import '../../core/translations.dart';

class MapViewCard extends StatefulWidget {
  final double height;
  final bool isInteractive;

  const MapViewCard({
    super.key,
    this.height = 180,
    this.isInteractive = true,
  });

  @override
  State<MapViewCard> createState() => _MapViewCardState();
}

class _MapViewCardState extends State<MapViewCard> {
  final MapController _mapController = MapController();
  List<StationModel> _stations = [];
  bool _isLoading = true;

  // Center on Addis Ababa (Meskel Square)
  final LatLng _addisAbaba = const LatLng(9.0107, 38.7613);

  @override
  void initState() {
    super.initState();
    _loadStations();
  }

  Future<void> _loadStations() async {
    final stations = await ApiService.getStations();
    if (mounted) {
      setState(() {
        _stations = stations;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Container(
      height: widget.height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Interactive OpenStreetMap Layer
            FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: _addisAbaba,
                initialZoom: 13.0,
                interactionOptions: InteractionOptions(
                  flags: widget.isInteractive
                      ? InteractiveFlag.all
                      : InteractiveFlag.none,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.smartbus_mobile',
                ),

                // Station Pins & Bus Location Markers
                MarkerLayer(
                  markers: [
                    // Station Pins
                    ..._stations.map(
                      (station) => Marker(
                        point: LatLng(station.latitude, station.longitude),
                        width: 40,
                        height: 40,
                        child: GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  '${AppTranslations.translate('Station', lang)}: ${AppTranslations.translate(station.name, lang)}',
                                ),
                                duration: const Duration(seconds: 2),
                              ),
                            );
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppTheme.blueAccent,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                              boxShadow: const [
                                BoxShadow(color: Colors.black26, blurRadius: 4),
                              ],
                            ),
                            child: const Icon(
                              Icons.location_on,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Active Bus Live Marker 🚌
                    Marker(
                      point: const LatLng(9.0050, 38.7750), // Moving bus near Bole
                      width: 44,
                      height: 44,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppTheme.orangeAccent,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2.5),
                          boxShadow: const [
                            BoxShadow(color: Colors.black38, blurRadius: 6),
                          ],
                        ),
                        child: const Icon(
                          Icons.directions_bus,
                          color: Colors.white,
                          size: 22,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            // Map Overlay Header Badge
            Positioned(
              top: 12,
              left: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.92),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(color: Colors.black12, blurRadius: 6),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppTheme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      AppTranslations.translate('Track Nearby Buses', lang),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
