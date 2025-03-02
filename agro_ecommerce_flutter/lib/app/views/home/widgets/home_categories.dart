import 'package:agro_ecommerce_flutter/app/constants/app_colors.dart';
import 'package:agro_ecommerce_flutter/app/controllers/product_controller.dart';
import 'package:agro_ecommerce_flutter/app/views/product/all_products.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/category_shimmer.dart';
import '../../../controllers/category_controller.dart';

class HomeCategories extends StatelessWidget {
  const HomeCategories({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CategoryController());
    return Obx(() {
      if(controller.isLoading.value) return CategoryShimmer();
      if(controller.allCategories.isEmpty){
        return Center(child: Text('No Data Found!', style: Theme.of(context).textTheme.bodyMedium!.apply(color: Colors.black),),);
      }
      return SizedBox(
        height: 80,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: controller.allCategories.length,
          itemBuilder: (context, index) {
            final category = controller.allCategories[index];
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  InkWell(
                    onTap: ()=> Get.to(()=>AllProducts(
                      title: category.name,
                      fetchProducts: ()=> ProductController.instance.fetchProductsByCategory(category.name),
                    )),
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.category, color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    category.name,
                    style: Theme.of(context).textTheme.bodySmall!.apply(color: Colors.black),
                  ),
                ],
              ),
            );
          },
        ),
      );
    });
  }
}
