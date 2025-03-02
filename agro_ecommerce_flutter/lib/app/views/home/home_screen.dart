import 'package:agro_ecommerce_flutter/app/bottom_navigation_menu.dart';
import 'package:agro_ecommerce_flutter/app/views/home/widgets/banner_slider.dart';
import 'package:agro_ecommerce_flutter/app/views/home/widgets/home_appbar.dart';
import 'package:agro_ecommerce_flutter/app/views/home/widgets/home_categories.dart';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

import '../../common_widgets/grid_layout.dart';
import '../../common_widgets/header_container.dart';
import '../../common_widgets/product_card_vertical.dart';
import '../../common_widgets/search_container.dart';
import '../../common_widgets/section_heading.dart';
import '../../common_widgets/vertical_product_shimmer.dart';
import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';
import 'package:get/get.dart';

import '../../controllers/product_controller.dart';
import '../product/all_products.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ProductController());
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            const PrimaryHeaderContainer(
              child: Column(
                children: [
                  CustomHomeAppbar(),
                  SizedBox(height: AppSizes.spaceBtwItems/2,),
                  // CustomSearchContainer(text: 'Search in Store',),
                  // SizedBox(height: AppSizes.spaceBtwItems,),
                  SizedBox(height: AppSizes.spaceBtwSections,)
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSizes.defaultSpace),
              child: Column(
                children: [
                  const BannerSlider(),
                  const SizedBox(height: AppSizes.spaceBtwItems,),
                  SectionHeading(title: 'Categories',showActionButton: false,),
                  SizedBox(height: AppSizes.spaceBtwItems,),
                  HomeCategories(),
                  SizedBox(height: AppSizes.spaceBtwItems,),
                  SectionHeading(
                      title: 'Popular Products',
                      onPressed: ()=> Get.to(()=> AllProducts(
                        title: 'Popular Products',
                        fetchProducts: ()=> controller.fetchPopularProducts(),
                      ))
                  ),
                  const SizedBox(height: AppSizes.spaceBtwItems/5,),
                  Obx((){
                    if(controller.isLoading.value) return VerticalProductShimmer();
                    if(controller.popularProducts.isEmpty){
                      return Center(child: Text('No Data Found!'),);
                    }else {
                      return GridLayout(itemCount: controller.popularProducts.length,
                        itemBuilder: (context, index) => ProductCardVertical(product: controller.popularProducts[index],),);
                    }
                  }),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
