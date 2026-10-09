import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/bus_arrival_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../core/theme.dart';
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

            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 15,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Minutes away big display & travel info (Matching Design Image)
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Big 05 min departure label
                        RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: '${bus.minutesAway.toString().padLeft(2, '0')}',
                                style: TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.w900,
                                  color: Theme.of(context).brightness == Brightness.dark
                                      ? Colors.white
                                      : const Color(0xFF1E293B),
                                ),
                              ),
                              const TextSpan(
                                text: ' min',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 20),

                        // Travel time & bus route badge
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text('Travel time: ', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                  const Text('15 min', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  const Spacer(),
                                  Text(
                                    bus.arrivalTime,
                                    style: const TextStyle(color: AppTheme.blueAccent, fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppTheme.orangeAccent,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.directions_bus, size: 12, color: Colors.white),
                                        const SizedBox(width: 4),
                                        Text(
                                          bus.routeNumber,
                                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(Icons.chevron_right, size: 16, color: Colors.grey),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppTheme.blueAccent,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Text('Express', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Origin & Destination timeline dots
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppTheme.blueAccent, width: 2),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          AppTranslations.translate('Meskel Square', lang),
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.info_outline, size: 20, color: Colors.grey),
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
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppTheme.orangeAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          AppTranslations.translate(bus.destination, lang),
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                        const Spacer(),

                        // Emerald Green Pill Ticket Button (Matching Design Image: "Ticket: 15 ETB")
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 3,
                            shadowColor: AppTheme.primaryColor.withOpacity(0.4),
                          ),
                          onPressed: () => onSelectBus(bus),
                          icon: const Icon(Icons.shopping_cart_outlined, size: 16),
                          label: Text(
                            'Ticket: 15 ${AppTranslations.translate('ETB', lang)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                      ],
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
