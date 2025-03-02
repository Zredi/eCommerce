
import 'address_model.dart';
import 'cart_item.dart';

class UserModel {
  int? id;
  String firstName;
  String lastName;
  String email;
  String? password;
  String phoneNo;
  List<dynamic>? orders;
  Cart? cart;
  List<AddressModel>? addresses;

  UserModel({
    this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.password,
    required this.phoneNo,
    this.orders,
    this.cart,
    this.addresses,
  });
  
  static UserModel empty()=> UserModel(id:0,firstName: '', lastName: '', email: '', password: null, phoneNo: '',orders: [], cart:null,addresses: []);

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'phoneNo': phoneNo,
      'orders': orders,
      'cart': cart?.toJson(),
      'addresses': addresses?.map((address) => address.toJson()).toList(),
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      password: null,
      phoneNo: json['phoneNo'],
      orders: json['orders'] ?? [],
      cart: json['cart'] != null ? Cart.fromJson(json['cart']) : null,
      addresses: json['addresses'] != null ? List<AddressModel>.from(json['addresses'].map((address) => AddressModel.fromJson(address))) : [],
    );
  }
}

class Cart {
  final int cartId;
  final List<CartItemModel> items;
  final double totalAmount;

  Cart({
    required this.cartId,
    required this.items,
    required this.totalAmount,
  });

  Map<String, dynamic> toJson() {
    return {
      'cartId': cartId,
      'items': items.map((item) => item.toJson()).toList(),
      'totalAmount': totalAmount,
    };
  }

  factory Cart.fromJson(Map<String, dynamic> json) {
    return Cart(
      cartId: json['cartId'],
      items: (json['items'] as List).map((item) => CartItemModel.fromJson(item)).toList(),
      totalAmount: json['totalAmount'].toDouble(),
    );
  }
}
