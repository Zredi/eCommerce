

import 'package:agro_ecommerce_flutter/app/common_widgets/vertical_product_shimmer.dart';
import 'package:agro_ecommerce_flutter/app/controllers/product_controller.dart';
import 'package:agro_ecommerce_flutter/app/models/Product.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/grid_layout.dart';
import '../../../common_widgets/product_card_vertical.dart';
import '../../../common_widgets/section_heading.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/category_controller.dart';
import '../../../models/Category.dart';
import '../../../models/SubCategory.dart';
import '../../product/all_products.dart';
import 'category_brands.dart';



class CategoryTab extends StatelessWidget {
  const CategoryTab({super.key, required this.subCategory});

  final SubCategory subCategory;

  @override
  Widget build(BuildContext context) {
    final controller = CategoryController.instance;
    return ListView(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: [
      Padding(
        padding: EdgeInsets.all(AppSizes.defaultSpace),
        child: Column(
          children: [

            // CategoryBrands(category: category),
            // SizedBox(height: AppSizes.spaceBtwItems,),

            FutureBuilder<List<Product>>(
              future: ProductController.instance.fetchProductsBySubCategory(subCategory.name),
              builder: (context, snapshot) {
                if(snapshot.connectionState == ConnectionState.waiting){
                  return VerticalProductShimmer();
                }else if(snapshot.hasError){
                  return Center(child: Text("something went wrong!"),);
                }else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No products found.'));
                }
                final products = snapshot.data!;
                return Column(
                  children: [
                    SectionHeading(
                      title: 'You might like',
                      showActionButton: true,
                      onPressed: ()=> Get.to(()=> AllProducts(
                        title: subCategory.name,
                        fetchProducts: ()=> ProductController.instance.fetchProductsBySubCategory(subCategory.name),
                      )),
                    ),
                    const SizedBox(height: AppSizes.spaceBtwItems,),
                    GridLayout(
                      itemCount: products.length < 4 ? products.length : 4,
                      itemBuilder: (context, index) => ProductCardVertical(product: products[index]),
                    ),
                  ],
                );
              }
            ),
          ],
        ),
      ),
     ]
    );
  }
}
