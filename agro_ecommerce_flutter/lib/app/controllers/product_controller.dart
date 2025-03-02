
import 'package:agro_ecommerce_flutter/app/models/Product.dart';
import 'package:agro_ecommerce_flutter/app/services/product_service.dart';
import 'package:get/get.dart';

class ProductController extends GetxController{
  static ProductController get instance => Get.find();

  final isLoading = false.obs;
  RxList<Product> popularProducts = <Product>[].obs;
  RxList<Product> categoryProducts = <Product>[].obs;
  RxList<Product> subCategoryProducts = <Product>[].obs;
  RxBool isPopularProductsFetched = false.obs;
  RxBool isCategoryProductsFetched = false.obs;

  final ProductService productService = ProductService();

  @override
  void onInit() {
    super.onInit();
    fetchPopularProducts();
  }


  Future<List<Product>> fetchPopularProducts() async {
    if (isPopularProductsFetched.value) {
      return popularProducts;
    }
    try {
      isLoading(true);
      List<Product> products = await productService.getPopularProducts();
      popularProducts.assignAll(products);
      isPopularProductsFetched(true);
    } catch (e) {
      print('Error fetching popular products: $e');
    } finally {
      isLoading(false);
    }

    return popularProducts;
  }

  Future<List<Product>> fetchProductsByCategory(String category) async {
    if (isCategoryProductsFetched.value) {
      return categoryProducts;
    }
    try {
      List<Product> products = await productService.getProductsByCategory(category);
      categoryProducts.assignAll(products);
      isCategoryProductsFetched(true);
    } catch (e) {
      print('Error fetching category products: $e');
    }
    return categoryProducts;
  }

  Future<List<Product>> fetchProductsBySubCategory(String subCategory) async {

    try {
      List<Product> products = await productService.getProductsBySubCategory(subCategory);
      subCategoryProducts.assignAll(products);
    } catch (e) {
      print('Error fetching category products: $e');
    }
    return subCategoryProducts;
  }

}
