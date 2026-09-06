import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/bus_arrival_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../core/translations.dart';
import 'bus_details_modal.dart';

class BusArrivalsList extends StatelessWidget {
  final List<BusArrivalModel> arrivals;
  final Function(BusArrivalModel) onSelectBus;

  const BusArrivalsList({
    super.key,
    required this.arrivals,
    required this.onSelectBus,
  });

  Color _getOccupancyColor(String occupancy) {
    switch (occupancy) {
      case 'low':
        return Colors.green;
      case 'medium':
        return Colors.orange;
      case 'high':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getOccupancyText(String occupancy, String lang) {
    switch (occupancy) {
      case 'low':
        return AppTranslations.translate('Seats available', lang);
      case 'medium':
        return AppTranslations.translate('Filling up', lang);
      case 'high':
        return AppTranslations.translate('Almost full', lang);
      default:
        return occupancy;
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Text(
              AppTranslations.translate('Upcoming Buses', lang),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              AppTranslations.translate('{0} buses', lang, [arrivals.length]),
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ],
        ),
        const SizedBox(height: 12),

        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: arrivals.length,
          itemBuilder: (context, index) {
            final bus = arrivals[index];

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 1.5,
              child: Padding(
                padding: const EdgeInsets.all(14.0),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.black12,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.directions_bus, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    bus.routeNumber,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  ),
                                  if (bus.accessible) ...[
                                    const SizedBox(width: 6),
                                    const Icon(Icons.accessible, size: 16, color: Colors.green),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                AppTranslations.translate('to {0}', lang, [AppTranslations.translate(bus.destination, lang)]),
                                style: const TextStyle(color: Colors.grey, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.more_vert),
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              shape: const RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                              ),
                              builder: (_) => BusDetailsModal(
                                bus: bus,
                                onBook: () => onSelectBus(bus),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.access_time, size: 14, color: Colors.grey),
                            const SizedBox(width: 4),
                            Text(
                              bus.minutesAway > 0
                                  ? AppTranslations.translate('{0} min', lang, [bus.minutesAway])
                                  : AppTranslations.translate('Arriving now', lang),
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                        Text(
                          _getOccupancyText(bus.occupancy, lang),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _getOccupancyColor(bus.occupancy),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => onSelectBus(bus),
                        child: Text(AppTranslations.translate('Buy Ticket', lang)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
