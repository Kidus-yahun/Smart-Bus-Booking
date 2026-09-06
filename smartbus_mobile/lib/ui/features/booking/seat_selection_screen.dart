import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/seat_model.dart';
import '../../../data/providers/language_provider.dart';
import '../../../data/services/api_service.dart';
import '../../core/translations.dart';

class SeatSelectionScreen extends StatefulWidget {
  final String busId;
  final int requiredSeats;
  final Function(List<String>) onSeatsSelected;

  const SeatSelectionScreen({
    super.key,
    required this.busId,
    required this.requiredSeats,
    required this.onSeatsSelected,
  });

  @override
  State<SeatSelectionScreen> createState() => _SeatSelectionScreenState();
}

class _SeatSelectionScreenState extends State<SeatSelectionScreen> {
  List<SeatModel> _seats = [];
  final List<String> _selectedSeats = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSeats();
  }

  Future<void> _loadSeats() async {
    final busNum = int.tryParse(widget.busId) ?? 1;
    final seats = await ApiService.getSeats(busNum);
    if (mounted) {
      setState(() {
        _seats = seats;
        _isLoading = false;
      });
    }
  }

  void _onSeatTap(SeatModel seat) {
    if (seat.status == SeatStatus.occupied || seat.status == SeatStatus.reserved) return;

    setState(() {
      if (_selectedSeats.contains(seat.id)) {
        _selectedSeats.remove(seat.id);
      } else if (_selectedSeats.length < widget.requiredSeats) {
        _selectedSeats.add(seat.id);
      } else {
        _selectedSeats.removeAt(0);
        _selectedSeats.add(seat.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context).language;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _legendItem(AppTranslations.translate('Available', lang), Colors.grey[300]!),
            const SizedBox(width: 16),
            _legendItem(AppTranslations.translate('Selected', lang), Colors.green),
            const SizedBox(width: 16),
            _legendItem(AppTranslations.translate('Occupied', lang), Colors.red),
          ],
        ),
        const SizedBox(height: 16),

        _isLoading
            ? const Center(child: CircularProgressIndicator())
            : Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 4,
                    childAspectRatio: 1.0,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                  ),
                  itemCount: _seats.length,
                  itemBuilder: (context, index) {
                    final seat = _seats[index];
                    final isSelected = _selectedSeats.contains(seat.id);

                    Color bg = Colors.grey[200]!;
                    if (seat.status == SeatStatus.occupied) bg = Colors.red;
                    if (isSelected) bg = Colors.green;

                    return GestureDetector(
                      onTap: () => _onSeatTap(seat),
                      child: Container(
                        decoration: BoxDecoration(
                          color: bg,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: isSelected ? Colors.green : Colors.grey[400]!),
                        ),
                        child: Center(
                          child: Text(
                            '${seat.row}${seat.column}',
                            style: TextStyle(
                              color: bg == Colors.grey[200] ? Colors.black : Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              foregroundColor: Colors.white,
            ),
            onPressed: _selectedSeats.isEmpty
                ? null
                : () => widget.onSeatsSelected(_selectedSeats),
            child: Text(AppTranslations.translate('Continue', lang)),
          ),
        ),
      ],
    );
  }

  Widget _legendItem(String label, Color color) {
    return Row(
      children: [
        Container(width: 16, height: 16, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4))),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}
