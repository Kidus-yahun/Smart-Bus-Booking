class TicketModel {
  final String id;
  final String ticketNumber;
  final String routeNumber;
  final String destination;
  final String boardingStop;
  final String fareType;
  final double priceEtb;
  final List<String> seatNumbers;
  final int quantity;
  final String status;
  final String travelDate;
  final String bookingTime;
  final String? qrCode;

  TicketModel({
    required this.id,
    required this.ticketNumber,
    required this.routeNumber,
    required this.destination,
    required this.boardingStop,
    required this.fareType,
    required this.priceEtb,
    required this.seatNumbers,
    required this.quantity,
    required this.status,
    required this.travelDate,
    required this.bookingTime,
    this.qrCode,
  });

  factory TicketModel.fromJson(Map<String, dynamic> json) {
    List<String> seats = [];
    if (json['seat_numbers'] != null) {
      seats = List<String>.from(json['seat_numbers']);
    }

    return TicketModel(
      id: json['id']?.toString() ?? '',
      ticketNumber: json['ticket_number'] ?? 'TKT-1001',
      routeNumber: json['route_number'] ?? 'AA-01',
      destination: json['destination'] ?? 'Bole Airport',
      boardingStop: json['boarding_station_name'] ?? json['boardingStop'] ?? 'Meskel Square',
      fareType: json['fare_type'] ?? 'Adult',
      priceEtb: (json['total_price_etb'] as num?)?.toDouble() ?? (json['price_etb'] as num?)?.toDouble() ?? 15.0,
      seatNumbers: seats,
      quantity: json['quantity'] ?? 1,
      status: json['status'] ?? 'confirmed',
      travelDate: json['travel_date'] ?? json['departure_time'] ?? DateTime.now().toIso8601String(),
      bookingTime: json['booking_time'] ?? DateTime.now().toIso8601String(),
      qrCode: json['qr_code'] ?? json['ticket_number'],
    );
  }
}
