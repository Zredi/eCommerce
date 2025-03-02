import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../models/cart.dart';


class CartService {

  final baseUrl = HttpHelper.baseUrl;

  Future<void> addItemToCart(int productId, int quantity, String token) async {
    try {
      final url = Uri.parse('$baseUrl/cart-items/item/add');
      final response = await http.post(
          url,
          headers: {'Authorization': 'Bearer $token',},
          body: {'productId': productId.toString(), 'quantity': quantity.toString(),}
      );

      if (response.statusCode == 200) {
        print('Item added successfully.');
      } else {
        throw Exception('Failed to add item to cart');
      }
    } catch (e) {
      print('Error adding item to cart: $e');
    }
  }

  Future<void> removeItemFromCart(int cartId, int itemId,String token) async {
    try {
      final url = Uri.parse('$baseUrl/cart-items/cart/$cartId/item/$itemId/remove');
      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print('Item removed successfully.');
      } else {
        throw Exception('Failed to remove item from cart');
      }
    } catch (e) {
      print('Error removing item from cart: $e');
    }
  }

  Future<void> updateItemQuantity(int cartId, int itemId, int quantity, String token) async {
    print('cartid: $cartId, itemid: $itemId, quantity: $quantity');
    try {
      final url = Uri.parse('$baseUrl/cart-items/cart/$cartId/item/$itemId/update?quantity=$quantity');

      final response = await http.put(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      print("response : ${response.body}");

      if (response.statusCode != 200) {
        throw Exception('Failed to update item quantity');
      }
    } catch (e) {
      print('Error updating item quantity: $e');
    }
  }

  Future<Cart> getCart(int userId, token) async {
    try {
      final url = Uri.parse('$baseUrl/carts/user/$userId/my-cart');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);

        Cart cart = Cart.fromJson(jsonResponse['data']);

        return cart;
      } else {
        throw Exception('Failed to retrieve cart');
      }
    } catch (e) {
      throw Exception('Error retrieving cart: $e');
    }
  }

  Future<double> getTotalCartPrice(int cartId, String token) async {
    final url = Uri.parse('$baseUrl/carts/$cartId/cart/total-price');

    final response = await http.get(url, headers: {
      'Authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      return (jsonResponse['data'] as num).toDouble();
    } else {
      throw Exception('Failed to fetch total cart price');
    }
  }

  Future<void> clearCart(int cartId, String token) async {
    try {
      final url = Uri.parse('$baseUrl/carts/$cartId/clear');
      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      print("response: ${response.body}");
      if (response.statusCode == 200) {
        print('Cart cleared successfully.');
      } else {
        throw Exception('Failed to clear cart');
      }
    } catch (e) {
      print('Error clearing cart: $e');
    }
  }


}
