import 'package:agro_ecommerce_flutter/app/common_widgets/product_card_vertical.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../constants/sizes.dart';
import '../controllers/all_product_controller.dart';
import '../models/Product.dart';
import 'grid_layout.dart';

class SortableProducts extends StatelessWidget {
  const SortableProducts({
    super.key, required this.products,
  });

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AllProductsController());
    controller.assignProducts(products);
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller.searchController,
                onChanged: (value) => controller.filterProducts(value),
                decoration: InputDecoration(
                  hintText: "Search products...",
                  prefixIcon: Icon(Iconsax.search_normal),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  isDense: true,
                ),
              ),
            ),
            SizedBox(width: AppSizes.spaceBtwInputFields),

            IconButton(
                icon: Icon(Iconsax.filter,size: 30,),
                onPressed: (){
                  Get.bottomSheet(
                    Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Get.isDarkMode ? Colors.black : Colors.white,
                        borderRadius: BorderRadius.vertical(top: Radius.circular(16))
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text("Sort By",style: TextStyle(fontWeight: FontWeight.bold,fontSize: AppSizes.fontSizeMd),),
                          ListTile(
                            title: Text("Name"),
                            onTap: (){
                              controller.sortProducts("Name");
                              Get.back();
                            },
                          ),
                          ListTile(
                            title: Text("Higher Price"),
                            onTap: () {
                              controller.sortProducts("Higher Price");
                              Get.back();
                            },
                          ),
                          ListTile(
                            title: Text("Lower Price"),
                            onTap: () {
                              controller.sortProducts("Lower Price");
                              Get.back();
                            },
                          ),
                        ],
                      ),
                    )
                  );
                }
            ),
            // Expanded(
            //   child: DropdownButtonFormField(
            //     decoration: InputDecoration(
            //       prefixIcon: Icon(Icons.filter_alt),
            //       border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            //       isDense: true,
            //     ),
            //     items: ['Name', 'Higher Price', 'Lower Price']
            //         .map((option) => DropdownMenuItem(value: option, child: Text(option)))
            //         .toList(),
            //     value: controller.selectedSortOption.value,
            //     onChanged: (value) => controller.sortProducts(value!),
            //   ),
            // ),
          ],
        ),
        SizedBox(height: AppSizes.spaceBtwSections,),
        Obx(
          ()=> controller.filteredProducts.isEmpty
              ? Padding(
            padding: EdgeInsets.all(20),
            child: Text("No Products Found", style: TextStyle(fontWeight: FontWeight.w500),),
          ):
          GridLayout(
            itemCount: controller.filteredProducts.length,
            itemBuilder: (context, index) => ProductCardVertical(product: controller.filteredProducts[index],) ,
          ),
        ),
      ],
    );
  }
}
