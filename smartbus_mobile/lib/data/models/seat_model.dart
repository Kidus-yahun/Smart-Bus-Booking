enum SeatStatus { available, occupied, selected, reserved }

class SeatModel {
  final String id;
  final String number;
  final SeatStatus status;
  final int row;
  final String column;

  SeatModel({
    required this.id,
    required this.number,
    required this.status,
    required this.row,
    required this.column,
  });

  factory SeatModel.fromJson(Map<String, dynamic> json) {
    SeatStatus parsedStatus = SeatStatus.available;
    final statusStr = json['status']?.toString().toLowerCase();
    if (statusStr == 'occupied') parsedStatus = SeatStatus.occupied;
    if (statusStr == 'reserved') parsedStatus = SeatStatus.reserved;

    return SeatModel(
      id: json['seat_id']?.toString() ?? json['id']?.toString() ?? '',
      number: json['seat_number'] ?? '',
      status: parsedStatus,
      row: json['row_number'] ?? json['row'] ?? 1,
      column: json['seat_position'] ?? json['column'] ?? 'A',
    );
  }
}
