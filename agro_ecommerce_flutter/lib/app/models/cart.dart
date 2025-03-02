
import 'Product.dart';

class Cart {
   int? id;
   List<CartItemModel>? items;
   double? totalAmount;

  Cart({
     this.id,
     this.items,
     this.totalAmount,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'items': items!.map((item) => item.toJson()).toList(),
      'totalAmount': totalAmount,
    };
  }

  factory Cart.fromJson(Map<String, dynamic> json) {
    return Cart(
      id: json['id'],
      items: (json['items'] as List).map((item) => CartItemModel.fromJson(item)).toList(),
      totalAmount: json['totalAmount'].toDouble(),
    );
  }
}


class CartItemModel {
   int? id;
   int? quantity;
   double? unitPrice;
   double? totalPrice;
   Product? product;

  CartItemModel({
     this.id,
     this.quantity,
     this.unitPrice,
     this.totalPrice,
     this.product,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
      'product': product!.toJson(),
    };
  }

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: json['id'],
      quantity: json['quantity'],
      unitPrice: json['unitPrice'].toDouble(),
      totalPrice : json['totalPrice'].toDouble(),
      product: Product.fromJson(json['product']),
    );
  }

}
