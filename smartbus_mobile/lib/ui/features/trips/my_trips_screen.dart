import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../data/models/ticket_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/translations.dart';

class MyTripsScreen extends StatefulWidget {
  const MyTripsScreen({super.key});

  @override
  State<MyTripsScreen> createState() => _MyTripsScreenState();
}

class _MyTripsScreenState extends State<MyTripsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<TicketModel> _tickets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadTickets();
  }

  Future<void> _loadTickets() async {
    final tickets = await ApiService.getMyTickets();
    if (mounted) {
      setState(() {
        _tickets = tickets;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    final activeTickets = _tickets.where((t) => t.status == 'confirmed' || t.status == 'pending').toList();
    final historyTickets = _tickets.where((t) => t.status == 'used' || t.status == 'cancelled').toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('My Trips', lang)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.black,
          tabs: [
            Tab(text: AppTranslations.translate('Active ({0})', lang, [activeTickets.length])),
            Tab(text: AppTranslations.translate('History ({0})', lang, [historyTickets.length])),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTicketList(activeTickets, lang),
                _buildTicketList(historyTickets, lang),
              ],
            ),
    );
  }

  Widget _buildTicketList(List<TicketModel> tickets, String lang) {
    if (tickets.isEmpty) {
      return const Center(child: Text('No trips found'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: tickets.length,
      itemBuilder: (context, index) {
        final ticket = tickets[index];

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text('#${ticket.ticketNumber}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: Colors.green[100], borderRadius: BorderRadius.circular(4)),
                      child: Text(
                        AppTranslations.translate('Confirmed', lang),
                        style: const TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(AppTranslations.translate(ticket.boardingStop, lang)),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward, size: 14, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(AppTranslations.translate(ticket.destination, lang)),
                  ],
                ),
                const SizedBox(height: 12),
                Center(
                  child: QrImageView(
                    data: ticket.qrCode ?? ticket.ticketNumber,
                    size: 100,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
