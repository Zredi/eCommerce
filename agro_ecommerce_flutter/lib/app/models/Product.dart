import 'package:agro_ecommerce_flutter/app/models/Category.dart';
import 'package:agro_ecommerce_flutter/app/models/Image_model.dart';

class Product {
  final int id;
  final String name;
  final String brand;
  final double price;
  final int stock;
  final String description;
  final String isPopular;
  final Category category;
  final List<ImageModel> images;

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.stock,
    required this.description,
    required this.isPopular,
    required this.category,
    required this.images,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      brand: json['brand'],
      price: json['price'].toDouble(),
      stock: json['stock'],
      description: json['description'],
      isPopular: json['isPopular'],
      category: Category.fromJson(json['category']),
      images: (json['images'] as List)
          .map((imageJson) => ImageModel.fromJson(imageJson))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'price': price,
      'stock': stock,
      'description': description,
      'isPopular': isPopular,
      'category': category.toJson(),
      'images': images.map((image) => image.toJson()).toList(),
    };
  }

}