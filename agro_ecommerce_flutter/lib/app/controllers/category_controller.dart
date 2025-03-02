
import 'package:agro_ecommerce_flutter/app/models/Category.dart';
import 'package:agro_ecommerce_flutter/app/services/category_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:get/get.dart';
import 'package:get/get_rx/get_rx.dart';

import '../models/SubCategory.dart';


class CategoryController extends GetxController{
  static CategoryController get instance => Get.find();

  final isLoading = false.obs;
  RxList<Category> allCategories = <Category>[].obs;
  RxList<SubCategory> allSubCategories = <SubCategory>[].obs;
  final featuredCategories = [].obs;
  final CategoryService categoryService = CategoryService();
  @override
  void onInit() {
    super.onInit();
    fetchCategories();
    fetchSubCategories();
  }

  Future<void> fetchCategories() async {
    try{
      isLoading.value = true;
      List<Category> categories = await categoryService.fetchCategories();
      allCategories.assignAll(categories);
    }catch(e){
      print("error fetching categories: $e");
    }finally{
      isLoading.value = false;
    }
  }

  Future<void> fetchSubCategories() async {
    try{
      isLoading.value = true;
      List<SubCategory> subCategories = await categoryService.fetchSubCategories();
      allSubCategories.assignAll(subCategories);
    }catch(e){
      print("error fetching categories: $e");
    }finally{
      isLoading.value = false;
    }
  }

}