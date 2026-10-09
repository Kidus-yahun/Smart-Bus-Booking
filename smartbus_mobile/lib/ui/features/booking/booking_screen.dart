import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/station_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/translations.dart';
import '../confirmation/ticket_confirmation_screen.dart';
import 'seat_selection_screen.dart';

class BookingScreen extends StatefulWidget {
  final String busId;
  final int? initialDestinationId;
  final int? initialBoardingId;

  const BookingScreen({
    super.key,
    required this.busId,
    this.initialDestinationId,
    this.initialBoardingId,
  });

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  int _step = 1; // 1: Station Selection, 2: Fare Selection, 3: Seat Selection, 4: Confirm
  List<StationModel> _stations = [];
  int? _boardingStationId;
  int? _destinationStationId;
  String _fareType = 'adult';
  int _quantity = 1;
  List<String> _selectedSeats = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _boardingStationId = widget.initialBoardingId ?? 1;
    _destinationStationId = widget.initialDestinationId ?? 2;
    _loadStations();
  }

  Future<void> _loadStations() async {
    final stations = await ApiService.getStations();
    if (mounted) {
      setState(() => _stations = stations);
    }
  }

  Future<void> _confirmBooking() async {
    setState(() => _isLoading = true);
    final scheduleId = int.tryParse(widget.busId) ?? 1;

    final ticket = await ApiService.bookTicket(
      scheduleId: scheduleId,
      fareType: _fareType,
      quantity: _quantity,
      boardingStationId: _boardingStationId ?? 1,
      destinationStationId: _destinationStationId ?? 2,
      selectedSeats: _selectedSeats,
    );

    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => TicketConfirmationScreen(ticket: ticket),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('Book Ticket', lang)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: _buildCurrentStep(lang),
        ),
      ),
    );
  }

  Widget _buildCurrentStep(String lang) {
    if (_step == 1) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppTranslations.translate('Select Stations', lang),
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),

          DropdownButtonFormField<int>(
            value: _boardingStationId,
            decoration: const InputDecoration(labelText: 'Boarding Station', border: OutlineInputBorder()),
            items: _stations.map((s) => DropdownMenuItem(value: s.id, child: Text(AppTranslations.translate(s.name, lang)))).toList(),
            onChanged: (val) => setState(() => _boardingStationId = val),
          ),
          const SizedBox(height: 16),

          DropdownButtonFormField<int>(
            value: _destinationStationId,
            decoration: const InputDecoration(labelText: 'Destination Station', border: OutlineInputBorder()),
            items: _stations.map((s) => DropdownMenuItem(value: s.id, child: Text(AppTranslations.translate(s.name, lang)))).toList(),
            onChanged: (val) => setState(() => _destinationStationId = val),
          ),
          const Spacer(),

          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
              onPressed: () => setState(() => _step = 2),
              child: Text(AppTranslations.translate('Continue', lang)),
            ),
          ),
        ],
      );
    }

    if (_step == 2) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppTranslations.translate('Select Fare Type', lang),
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          ListTile(
            title: const Text('Adult / Standard'),
            subtitle: const Text('Standard Fare - 15 ETB'),
            leading: Radio<String>(
              value: 'adult',
              groupValue: _fareType,
              onChanged: (v) => setState(() => _fareType = v!),
            ),
          ),
          ListTile(
            title: const Text('Student'),
            subtitle: const Text('With Student ID - 10 ETB'),
            leading: Radio<String>(
              value: 'student',
              groupValue: _fareType,
              onChanged: (v) => setState(() => _fareType = v!),
            ),
          ),
          const Spacer(),

          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
              onPressed: () => setState(() => _step = 3),
              child: Text(AppTranslations.translate('Continue', lang)),
            ),
          ),
        ],
      );
    }

    if (_step == 3) {
      return SeatSelectionScreen(
        busId: widget.busId,
        requiredSeats: _quantity,
        onSeatsSelected: (seats) {
          setState(() {
            _selectedSeats = seats;
            _step = 4;
          });
        },
      );
    }

    // Step 4: Summary & Confirm
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppTranslations.translate('Review', lang),
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),

        Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Selected Seats:'),
                    Text(_selectedSeats.join(', ')),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Fare:'),
                    Text('${_quantity * 15} ETB', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  ],
                ),
              ],
            ),
          ),
        ),
        const Spacer(),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
            onPressed: _isLoading ? null : _confirmBooking,
            child: _isLoading
                ? const CircularProgressIndicator(color: Colors.white)
                : Text(AppTranslations.translate('Confirm Booking ({0} ETB)', lang, [_quantity * 15])),
          ),
        ),
      ],
    );
  }
}
