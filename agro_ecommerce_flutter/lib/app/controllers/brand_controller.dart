
import 'package:agro_ecommerce_flutter/app/controllers/product_controller.dart';
import 'package:agro_ecommerce_flutter/app/services/product_service.dart';
import 'package:get/get.dart';

import '../models/Product.dart';
import 'all_product_controller.dart';



class BrandController extends GetxController{
  static BrandController get instance => Get.find();

  final RxList<dynamic> allBrands = <String>[].obs;
  final RxList<dynamic> featuredBrands = <String>[].obs;
  RxBool isLoading = false.obs;

  final ProductService productService = ProductService();


  @override
  void onInit() {
    super.onInit();
    getFeaturedBrands();
    getAllBrands();
  }

  Future<void> getAllBrands()async{
    try{
      isLoading(true);
      List<Product> products = await productService.getAllProducts();
      print("products fetched: $products");
      final brands = products.map((product) => product.brand).toSet().toList();
      allBrands.assignAll(brands);
      print('allbrands: $allBrands');
    }catch(e){
      print("error fetching brands $e");
    }finally{
      isLoading(false);
    }
  }

  Future<void> getFeaturedBrands()async {
    try {
      isLoading(true);
      List<Product> products = await ProductController.instance.popularProducts;

      final brands = products
          .map((product) => product.brand)
          .toSet()
          .toList();

      featuredBrands.assignAll(brands);
      print("brands: $featuredBrands");

    } catch (e) {
      print('Error fetching featured brands: $e');
    } finally {
      isLoading(false);
    }
  }


  Future<List<Product>> getBrandProducts(String brand)async{
    try {
      List<Product> products = await productService.getProductsByBrand(brand);
      return products;
    } catch (e) {
      print("Error fetching products for brand $brand: $e");
      return [];
    }
  }

  Future<List<String>> getBrandsOfCategory(String category)async{
    try {
      if (allBrands.isEmpty) {
        print("No brands available.");
        return [];
      }

      List<Product> products = await productService.getAllProducts();

      List<String> brands = products
          .where((product) => product.category.name == category)
          .map((product) => product.brand)
          .toSet()
          .toList();

      return brands;
    } catch (e) {
      print("Error fetching brands by category: $e");
      return [];
    }
  }

}