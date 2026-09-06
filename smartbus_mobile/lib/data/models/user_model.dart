class UserModel {
  final int id;
  final String email;
  final String fullName;
  final String? phone;
  final String? avatarUrl;
  final String token;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    this.avatarUrl,
    required this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json, String token) {
    return UserModel(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      fullName: json['full_name'] ?? json['name'] ?? 'User',
      phone: json['phone_number'] ?? json['phone'] ?? '+251-9-00-000-000',
      avatarUrl: json['avatar_url'] ?? json['avatar'],
      token: token,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone_number': phone,
      'avatar_url': avatarUrl,
    };
  }
}
