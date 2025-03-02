
import 'dart:convert';

import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import '../models/address_model.dart';
import '../models/user_model.dart';

class UserService{

  final deviceStorage = GetStorage();

  Future<UserModel> fetchUserDetails(int userId) async {
    try {
      final token = await deviceStorage.read('token');

      final response = await http.get(
        Uri.parse('${HttpHelper.baseUrl}/users/$userId/user'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['data'] != null) {
          return UserModel.fromJson(responseData['data']);
        } else {
          print('Error: User data not found in response');
          throw Exception('User not found');
        }
      } else {
        print('Error: Failed to fetch user details, Status Code: ${response.statusCode}');
        throw Exception('Failed to fetch user details: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in fetchUserDetails: $e');
      throw Exception('Failed to fetch user details');
    }
  }

  Future<AddressModel> addAddress(int userId, AddressModel address) async {
    try {

      final response = await http.post(
        Uri.parse('${HttpHelper.baseUrl}/address/add/$userId'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(address.toJson()),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        return AddressModel.fromJson(responseData['data']);
      } else {
        print('Error: Failed to add address, Status Code: ${response.statusCode}');
        throw Exception('Failed to add address: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in addAddress: $e');
      throw Exception('Failed to add address');
    }
  }

}