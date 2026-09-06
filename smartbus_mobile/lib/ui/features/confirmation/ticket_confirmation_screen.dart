import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../data/models/ticket_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../core/translations.dart';

class TicketConfirmationScreen extends StatelessWidget {
  final TicketModel ticket;

  const TicketConfirmationScreen({super.key, required this.ticket});

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('SmartBus Ticket', lang)),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 64),
              const SizedBox(height: 12),

              Text(
                AppTranslations.translate('Ticket Purchased!', lang),
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),

              // QR Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 3,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      QrImageView(
                        data: ticket.qrCode ?? ticket.ticketNumber,
                        version: QrVersions.auto,
                        size: 160.0,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '#${ticket.ticketNumber}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 1),
                      ),
                      const Divider(height: 24),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('From', style: TextStyle(color: Colors.grey, fontSize: 12)),
                              Text(AppTranslations.translate(ticket.boardingStop, lang), style: const TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const Icon(Icons.arrow_forward, color: Colors.grey),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text('To', style: TextStyle(color: Colors.grey, fontSize: 12)),
                              Text(AppTranslations.translate(ticket.destination, lang), style: const TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
                  onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                  child: const Text('Back to Home'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
