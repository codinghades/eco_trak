class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String barangay;
  final String street;
  final String role; // 'resident' or 'driver'
  final bool isCreatedByAdmin;
  final DateTime createdAt;
  final DateTime? lastLogin;
  final bool isEmailVerified;

  const UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.barangay,
    required this.street,
    required this.role,
    required this.isCreatedByAdmin,
    required this.createdAt,
    this.lastLogin,
    required this.isEmailVerified,
  });

  // Convert UserModel to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'barangay': barangay,
      'street': street,
      'role': role,
      'isCreatedByAdmin': isCreatedByAdmin,
      'createdAt': createdAt.toIso8601String(),
      'lastLogin': lastLogin?.toIso8601String(),
      'isEmailVerified': isEmailVerified,
    };
  }

  // Create UserModel from Firestore Map
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] ?? '',
      fullName: map['fullName'] ?? '',
      email: map['email'] ?? '',
      barangay: map['barangay'] ?? '',
      street: map['street'] ?? '',
      role: map['role'] ?? 'resident',
      isCreatedByAdmin: map['isCreatedByAdmin'] ?? false,
      createdAt: DateTime.parse(map['createdAt']),
      lastLogin: map['lastLogin'] != null ? DateTime.parse(map['lastLogin']) : null,
      isEmailVerified: map['isEmailVerified'] ?? false,
    );
  }

  // Create a copy with updated fields
  UserModel copyWith({
    String? id,
    String? fullName,
    String? email,
    String? barangay,
    String? street,
    String? role,
    bool? isCreatedByAdmin,
    DateTime? createdAt,
    DateTime? lastLogin,
    bool? isEmailVerified,
  }) {
    return UserModel(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      barangay: barangay ?? this.barangay,
      street: street ?? this.street,
      role: role ?? this.role,
      isCreatedByAdmin: isCreatedByAdmin ?? this.isCreatedByAdmin,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      isEmailVerified: isEmailVerified ?? this.isEmailVerified,
    );
  }
}