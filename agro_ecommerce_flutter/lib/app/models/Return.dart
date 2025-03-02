class Return{

  final int id;
  final int orderId;
  final int userId;
  final String reason;
  final String status;
  final DateTime requestDate;

  Return({
    required this.id,
    required this.orderId,
    required this.userId,
    required this.reason,
    required this.status,
    required this.requestDate
  });

  factory Return.fromJson(Map<String, dynamic> json) {
    return Return(
      id: json['id'],
      orderId: json['orderId'],
      userId: json['userId'],
      reason: json['reason'],
      status: json['status'],
      requestDate: json['requestDate'] is String ? DateTime.parse(json['requestDate']) : json['requestDate']
    );
  }
}