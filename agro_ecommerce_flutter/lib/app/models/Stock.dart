
import 'Product.dart';

class Stock{
  final int id;
  final Product product;
  final int currentStock;

  Stock({required this.id, required this.product, required this.currentStock});

  factory Stock.fromJson(Map<String, dynamic> json) {
    return Stock(
      id: json['id'],
      product: Product.fromJson(json['product']),
      currentStock: json['currentStock'],
    );
  }
}