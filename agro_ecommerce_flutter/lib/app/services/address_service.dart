import 'package:agro_ecommerce_flutter/app/models/address_model.dart';
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AddressService {
  final baseUrl = HttpHelper.baseUrl;

  Future<AddressModel?> fetchAddressById(int addressId) async {
    try {
      final url = Uri.parse('$baseUrl/address/$addressId/address');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        final addressData = jsonResponse['data'];
        return AddressModel.fromJson(addressData);
      } else {
        throw Exception('Failed to fetch address: ${response.body}');
      }
    } catch (e) {
      print('Error fetching address: $e');
      return null;
    }
  }
}
