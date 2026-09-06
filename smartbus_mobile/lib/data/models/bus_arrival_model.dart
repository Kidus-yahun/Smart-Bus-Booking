class BusArrivalModel {
  final String id;
  final String routeNumber;
  final String destination;
  final String arrivalTime;
  final int minutesAway;
  final String occupancy;
  final bool accessible;
  final int originStationId;
  final int destinationStationId;

  BusArrivalModel({
    required this.id,
    required this.routeNumber,
    required this.destination,
    required this.arrivalTime,
    required this.minutesAway,
    required this.occupancy,
    required this.accessible,
    required this.originStationId,
    required this.destinationStationId,
  });

  factory BusArrivalModel.fromJson(Map<String, dynamic> json) {
    return BusArrivalModel(
      id: json['id']?.toString() ?? '',
      routeNumber: json['route_number'] ?? 'AA-01',
      destination: json['destination'] ?? 'Bole Airport',
      arrivalTime: json['arrival_time'] ?? '10:30 AM',
      minutesAway: json['minutes_away'] ?? 5,
      occupancy: json['occupancy'] ?? 'low',
      accessible: json['accessible'] ?? true,
      originStationId: json['origin_station_id'] ?? 1,
      destinationStationId: json['destination_station_id'] ?? 2,
    );
  }
}
