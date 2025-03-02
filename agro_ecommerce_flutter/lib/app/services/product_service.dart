import '../models/Product.dart';
import '../utils/http_util.dart';

class ProductService{

  Future<List<Product>> getAllProducts() async {
    try {
      final response = await HttpHelper.get('products');
      // print("all product: $response");
      List<dynamic> data = response['data'];
      return data.map((product) => Product.fromJson(product)).toList();
    } catch (e) {
      throw Exception('Error fetching products: $e');
    }
  }

  Future<List<Product>> getPopularProducts() async {
    try {
      final response = await HttpHelper.get('products/popular');
      // print("response: $response");
      List<dynamic> data = response['data'];
      // print("data: $data");
      return data.map((product) => Product.fromJson(product)).toList();
    } catch (e) {
      throw Exception('Error fetching featured products: $e');
    }
  }

  Future<List<Product>> getProductsByCategory(String category) async {
    try {
      final response = await HttpHelper.get('products/product/$category/all/products');
      // print("response: $response");
      List<dynamic> data = response['data'];
      // print("data: $data");
      return data.map((product) => Product.fromJson(product)).toList();
    } catch (e) {
      throw Exception('Error fetching products by category: $e');
    }
  }

  Future<List<Product>> getProductsBySubCategory(String subCategory) async {
    try {
      final response = await HttpHelper.get('products/product/subcategory/$subCategory/all/products');
      // print("response: $response");
      List<dynamic> data = response['data'];
      // print("data: $data");
      return data.map((product) => Product.fromJson(product)).toList();
    } catch (e) {
      throw Exception('Error fetching products by subcategory: $e');
    }
  }

  Future<List<Product>> getProductsByBrand(String brand) async {
    try {
      final response = await HttpHelper.get('products/product/by-brand?brand=$brand');
      // print("Response for brand $brand: $response");
      List<dynamic> data = response['data'];
      return data.map((product) => Product.fromJson(product)).toList();
    } catch (e) {
      throw Exception('Error fetching products by brand: $e');
    }
  }

}