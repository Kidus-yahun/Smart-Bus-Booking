class StationModel {
  final int id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;

  StationModel({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
  });

  factory StationModel.fromJson(Map<String, dynamic> json) {
    return StationModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      address: json['address'] ?? 'Addis Ababa, Ethiopia',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 9.0084,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 38.7635,
    );
  }
}
