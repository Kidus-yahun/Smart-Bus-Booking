import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/bus_arrival_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../core/translations.dart';

class BusDetailsModal extends StatelessWidget {
  final BusArrivalModel bus;
  final VoidCallback onBook;

  const BusDetailsModal({super.key, required this.bus, required this.onBook});

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  const Icon(Icons.directions_bus, size: 28),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        bus.routeNumber,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        AppTranslations.translate('to {0}', lang, [AppTranslations.translate(bus.destination, lang)]),
                        style: const TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const Divider(height: 24),

          // Route Details
          Text(
            AppTranslations.translate('Route Information', lang),
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.location_on, size: 18, color: Colors.blue),
              const SizedBox(width: 6),
              Text(AppTranslations.translate('Addis Ababa', lang)),
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward, size: 14, color: Colors.grey),
              const SizedBox(width: 8),
              const Icon(Icons.location_on, size: 18, color: Colors.red),
              const SizedBox(width: 6),
              Text(AppTranslations.translate(bus.destination, lang)),
            ],
          ),
          const SizedBox(height: 16),

          // Price & Status
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppTranslations.translate('Ticket Price', lang),
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                  Text(
                    '15 ${AppTranslations.translate('ETB', lang)}',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  onBook();
                },
                icon: const Icon(Icons.confirmation_number_outlined),
                label: Text(AppTranslations.translate('Buy Ticket', lang)),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
