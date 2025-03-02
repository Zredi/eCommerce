
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/brand_card.dart';
import '../../common_widgets/brand_shimmer.dart';
import '../../common_widgets/grid_layout.dart';
import '../../common_widgets/section_heading.dart';
import '../../constants/sizes.dart';
import '../../controllers/brand_controller.dart';
import 'brand_products.dart';


class AllBrandsScreen extends StatelessWidget {
  const AllBrandsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final brandController = BrandController.instance;
    return Scaffold(
      appBar: CustomAppBar(
        title: Text('Brands'),
        showBackArrorw: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            children: [
              Obx(() {
                if (brandController.isLoading.value)
                  return BrandShimmer(
                    itemCount: brandController.allBrands.length,
                  );
                if (brandController.allBrands.isEmpty) {
                  return Center(
                    child: Text('No Data Found!'),
                  );
                }
                return GridLayout(
                  mainAxisExtent: 50,
                  itemCount: brandController.allBrands.length,
                  itemBuilder: (context, index) {
                    final brand = brandController.allBrands[index];
                    return BrandCard(
                      showBorder: true,
                      brand: brand,
                      onTap: ()=> Get.to(()=> BrandProducts(brand: brand,)),
                    );
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
