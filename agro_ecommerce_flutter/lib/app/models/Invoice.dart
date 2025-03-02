import 'package:intl/intl.dart';
import './order_model.dart';

class Invoice {
  final int id;
  final OrderModel? order;
  final String invoiceNumber;
  final DateTime invoiceDate;
  final double totalAmount;

  Invoice({
    required this.id,
    this.order,
    required this.invoiceNumber,
    required this.invoiceDate,
    required this.totalAmount,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    return Invoice(
      id: json['id'],
      order: json['order'] != null ? OrderModel.fromJson(json['order']) : null,
      invoiceNumber: json['invoiceNumber'],
      invoiceDate: DateTime.parse(json['invoiceDate']),
      totalAmount: json['totalAmount']?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order': order?.toJson(),
      'invoiceNumber': invoiceNumber,
      'invoiceDate': invoiceDate.toIso8601String().split('T')[0], // Format as YYYY-MM-DD
      'totalAmount': totalAmount,
    };
  }

  @override
  String toString() {
    return 'Invoice{id: $id, invoiceNumber: $invoiceNumber, invoiceDate: $invoiceDate, totalAmount: $totalAmount}';
  }
}