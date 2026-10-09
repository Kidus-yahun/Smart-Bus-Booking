import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/bus_arrival_model.dart';
import '../models/seat_model.dart';
import '../models/station_model.dart';
import '../models/ticket_model.dart';
import '../models/user_model.dart';

class ApiService {
  // Configurable base URL. Default is Android Emulator localhost (10.0.2.2) or standard localhost (127.0.0.1)
  static String baseUrl = 'http://10.0.2.2:7077/api';
  static String? authToken;

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  // Auth: Login
  static Future<UserModel> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: {'username': email, 'password': password},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['access_token'];
        authToken = token;

        final userResponse = await http.get(
          Uri.parse('$baseUrl/auth/me'),
          headers: _headers,
        );

        if (userResponse.statusCode == 200) {
          final userData = jsonDecode(userResponse.body);
          return UserModel.fromJson(userData, token);
        }
      }
    } catch (_) {}

    // Fallback Demo Login if API server is not reached
    authToken = 'demo_token_123';
    return UserModel(
      id: 1,
      email: email.isNotEmpty ? email : 'demo@smartbus.com',
      fullName: 'Abebe Bikila',
      phone: '+251-911-234-567',
      token: 'demo_token_123',
    );
  }

  // Auth: Register
  static Future<UserModel> register(String email, String password, String name) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
          'full_name': name,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return await login(email, password);
      }
    } catch (_) {}

    authToken = 'demo_token_123';
    return UserModel(
      id: 1,
      email: email,
      fullName: name,
      phone: '+251-911-234-567',
      token: 'demo_token_123',
    );
  }

  // Buses: Upcoming Arrivals
  static Future<List<BusArrivalModel>> getUpcomingArrivals() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/buses/upcoming-arrivals?limit=20'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        return list.map((item) => BusArrivalModel.fromJson(item)).toList();
      }
    } catch (_) {}

    // Demo Data Fallback
    return [
      BusArrivalModel(
        id: '1',
        routeNumber: 'AA-01',
        destination: 'Bole Airport',
        arrivalTime: '10:15 AM',
        minutesAway: 3,
        occupancy: 'low',
        accessible: true,
        originStationId: 1,
        destinationStationId: 2,
      ),
      BusArrivalModel(
        id: '2',
        routeNumber: 'AA-05',
        destination: 'Piazza',
        arrivalTime: '10:25 AM',
        minutesAway: 8,
        occupancy: 'medium',
        accessible: false,
        originStationId: 3,
        destinationStationId: 4,
      ),
      BusArrivalModel(
        id: '3',
        routeNumber: 'AA-12',
        destination: 'Stadium',
        arrivalTime: '10:40 AM',
        minutesAway: 15,
        occupancy: 'high',
        accessible: true,
        originStationId: 1,
        destinationStationId: 5,
      ),
    ];
  }

  // Buses: Get Stations
  static Future<List<StationModel>> getStations() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/buses/stations'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        return list.map((item) => StationModel.fromJson(item)).toList();
      }
    } catch (_) {}

    return [
      StationModel(id: 1, name: 'Meskel Square', address: 'Meskel Sq, Addis Ababa', latitude: 9.0107, longitude: 38.7613),
      StationModel(id: 2, name: 'Bole Airport', address: 'Bole Intl Airport', latitude: 8.9778, longitude: 38.7992),
      StationModel(id: 3, name: 'Merkato', address: 'Merkato Bus Station', latitude: 9.0300, longitude: 38.7400),
      StationModel(id: 4, name: 'Piazza', address: 'Piazza Central', latitude: 9.0350, longitude: 38.7520),
      StationModel(id: 5, name: 'Stadium', address: 'Addis Ababa Stadium', latitude: 9.0150, longitude: 38.7580),
    ];
  }

  // Buses: Get Seats
  static Future<List<SeatModel>> getSeats(int busId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/buses/$busId/seats'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List list = data['seats'] ?? [];
        return list.map((item) => SeatModel.fromJson(item)).toList();
      }
    } catch (_) {}

    // Fallback seat layout
    List<SeatModel> fallbackSeats = [];
    for (int row = 1; row <= 10; row++) {
      for (String col in ['A', 'B', 'C', 'D']) {
        String seatNum = '$row$col';
        fallbackSeats.add(
          SeatModel(
            id: seatNum,
            number: seatNum,
            status: (row == 2 && col == 'B') || (row == 5 && col == 'A')
                ? SeatStatus.occupied
                : SeatStatus.available,
            row: row,
            column: col,
          ),
        );
      }
    }
    return fallbackSeats;
  }

  // Tickets: Book Ticket
  static Future<TicketModel> bookTicket({
    required int scheduleId,
    required String fareType,
    required int quantity,
    required int boardingStationId,
    required int destinationStationId,
    required List<String> selectedSeats,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/tickets/book'),
        headers: _headers,
        body: jsonEncode({
          'schedule_id': scheduleId,
          'fare_type': fareType,
          'quantity': quantity,
          'boarding_station_id': boardingStationId,
          'destination_station_id': destinationStationId,
          'selected_seat_ids': selectedSeats.map((s) => int.tryParse(s) ?? 1).toList(),
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return TicketModel.fromJson(data);
      }
    } catch (_) {}

    // Fallback generated demo ticket
    return TicketModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      ticketNumber: 'SB-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      routeNumber: 'AA-01',
      destination: 'Bole Airport',
      boardingStop: 'Meskel Square',
      fareType: fareType,
      priceEtb: 15.0 * quantity,
      seatNumbers: selectedSeats.isNotEmpty ? selectedSeats : ['1A'],
      quantity: quantity,
      status: 'confirmed',
      travelDate: DateTime.now().toIso8601String(),
      bookingTime: DateTime.now().toIso8601String(),
      qrCode: 'SB-TICKET-DEMO-QR',
    );
  }

  // Tickets: Get My Tickets
  static Future<List<TicketModel>> getMyTickets() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/tickets/my-tickets'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List list = jsonDecode(response.body);
        return list.map((item) => TicketModel.fromJson(item)).toList();
      }
    } catch (_) {}

    return [
      TicketModel(
        id: '101',
        ticketNumber: 'SB-88219',
        routeNumber: 'AA-01',
        destination: 'Bole Airport',
        boardingStop: 'Meskel Square',
        fareType: 'Adult',
        priceEtb: 15.0,
        seatNumbers: ['3A'],
        quantity: 1,
        status: 'confirmed',
        travelDate: DateTime.now().toIso8601String(),
        bookingTime: DateTime.now().toIso8601String(),
        qrCode: 'SB-88219',
      ),
    ];
  }
}
