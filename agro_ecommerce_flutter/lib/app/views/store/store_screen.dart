
import 'package:agro_ecommerce_flutter/app/utils/device_utils.dart';
import 'package:agro_ecommerce_flutter/app/views/store/widgets/category_tab.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/brand_card.dart';
import '../../common_widgets/brand_shimmer.dart';
import '../../common_widgets/cart_menu_icon.dart';
import '../../common_widgets/grid_layout.dart';
import '../../common_widgets/search_container.dart';
import '../../common_widgets/section_heading.dart';
import '../../common_widgets/tabbar.dart';
import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';
import '../../controllers/brand_controller.dart';
import '../../controllers/category_controller.dart';
import '../../utils/helper_functions.dart';
import '../brand/all_brands.dart';
import '../brand/brand_products.dart';



class StoreScreen extends StatelessWidget {
  const StoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = CategoryController.instance.allCategories;
    final subCategories = CategoryController.instance.allSubCategories;
    final brandController = Get.put(BrandController());
    return DefaultTabController(
      length: categories.length,
      child: Scaffold(
        appBar:
            AppBar(
              title: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Store',
                  style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                    color: AppColors.white
                  ),
                ),
              ),
              backgroundColor: AppColors.primary,

              actions: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CartCounterIcon(iconColor: AppColors.white,counterBgColor: AppColors.secondary,counterTextColor: AppColors.white,),
                ),
              ],
            ),
        // CustomAppBar(
        //   title: Text('Store',style: Theme.of(context).textTheme.headlineMedium,),
        //   actions: [
        //     CartCounterIcon(iconColor: AppColors.white,counterBgColor: AppColors.black,counterTextColor: AppColors.white,),
        //   ],
        // ),
        body: NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                SliverAppBar(
                  automaticallyImplyLeading: false,
                  pinned: true,
                  floating: true,
                  backgroundColor: HelperFunctions.isDarkMode(context) ? AppColors.black : AppColors.white,
                  expandedHeight: brandController.featuredBrands.length >= 6 ? 370 : 250 + (brandController.featuredBrands.length *20),
                  flexibleSpace: Padding(
                    padding: EdgeInsets.all(AppSizes.defaultSpace),
                    child: ListView(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      children: [
                        CustomSearchContainer(text: 'Search in Store', showBorder: true,showBackground: false,padding: EdgeInsets.zero,),
                        SectionHeading(title: 'Popular Brands',onPressed: ()=> Get.to(()=> AllBrandsScreen()),),
                        SizedBox(height: AppSizes.spaceBtwItems/1.5,),

                        Obx(
                          (){
                            if(brandController.isLoading.value) return BrandShimmer(itemCount: 6,);
                            if(brandController.featuredBrands.isEmpty){
                              return Center(child: Text('No Data Found!'),);
                            }
                            return GridLayout(
                              mainAxisExtent: 50,
                              itemCount: brandController.featuredBrands.length < 6
                                ? brandController.featuredBrands.length : 6,
                              itemBuilder: (context, index) {
                                final brand = brandController.featuredBrands[index];
                                return BrandCard(
                                  showBorder: true,
                                  brand: brand,
                                  onTap: ()=> Get.to(()=> BrandProducts(brand: brand)),
                                );
                              },
                            );
                          }
                        ),
                      ],
                    ),
                  ),
                  bottom: CustomTabBar(
                      tabs: subCategories.map((subcategory) => Tab(child: Text(subcategory.name),)).toList(),
                  ),
                ),
              ];
            },
            body: TabBarView(
                children: subCategories.map((subcategory) => CategoryTab(subCategory: subcategory,)).toList(),
            ),
        ),
      ),
    );
  }
}


