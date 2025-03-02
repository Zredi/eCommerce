
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

import '../models/Product.dart';
import '../services/product_service.dart';

class AllProductsController extends GetxController {
  static AllProductsController get instance => Get.find();

  final RxString selectedSortOption = 'Name'.obs;
  final RxList<Product> products = <Product>[].obs;
  final RxList<Product> filteredProducts = <Product>[].obs;
  final TextEditingController searchController = TextEditingController();

  final ProductService productService = ProductService();

  Future fetchPopularProducts() async {
    try {
      List<Product> popularproducts = await productService.getPopularProducts();
      return popularproducts;
    } catch (e) {
      print('Error fetching featured products: $e');
    }
  }

  void filterProducts(String query) {
    if (query.isEmpty) {
      filteredProducts.assignAll(products);
    } else {
      filteredProducts.assignAll(
        products.where((product) =>
            product.name.toLowerCase().contains(query.toLowerCase())),
      );
    }
    sortProducts(selectedSortOption.value);
  }

  void sortProducts(String sortOption){
    selectedSortOption.value = sortOption;
    List<Product> sortedList = List.from(filteredProducts);
    switch (sortOption){
      case 'Name':
        sortedList.sort((a, b) => a.name.compareTo(b.name),);
        break;
      case 'Higher Price':
        sortedList.sort((a, b) => b.price.compareTo(a.price),);
        break;
      case 'Lower Price':
        sortedList.sort((a, b) => a.price.compareTo(b.price),);
        break;
      default:
        sortedList.sort((a, b) => a.name.compareTo(b.name));
    }
    filteredProducts.assignAll(sortedList);
  }

  void assignProducts(List<Product> products) {
    this.products.assignAll(products);
    filterProducts(searchController.text);
  }
}