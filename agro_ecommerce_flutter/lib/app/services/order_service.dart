import 'package:agro_ecommerce_flutter/app/models/Invoice.dart';
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../models/order_model.dart';

class OrderService {
  final baseUrl = HttpHelper.baseUrl;

  Future<Invoice> getInvoiceByOrderId(int orderId) async {
    try {
      final url = Uri.parse('$baseUrl/invoices/$orderId');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return Invoice.fromJson(jsonResponse);
      } else {
        throw Exception('Failed to fetch invoice: ${response.body}');
      }
    } catch (e) {
      print('Error fetching invoice: $e');
      throw e;
    }
  }

  Future<void> createOrder(int userId, int addressId, String token) async {
    try {
      final url = Uri.parse('$baseUrl/orders/order?userId=$userId&addressId=$addressId');
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      print("response: ${response.body}");
      if (response.statusCode == 200) {
        print('Order created successfully.');
      } else {
        throw Exception('Failed to create order: ${response.body}');
      }
    } catch (e) {
      print('Error creating order: $e');
      throw e;
    }
  }

  Future<List<OrderModel>> fetchUserOrders(int userId, String token) async {
    try {
      final url = Uri.parse('$baseUrl/orders/user/$userId/order');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        final List<dynamic> ordersData = jsonResponse['data'];
        return ordersData.map((orderJson) => OrderModel.fromJson(orderJson)).toList();
      } else {
        throw Exception('Failed to fetch user orders: ${response.body}');
      }
    } catch (e) {
      print('Error fetching user orders: $e');
      throw e;
    }
  }

}
