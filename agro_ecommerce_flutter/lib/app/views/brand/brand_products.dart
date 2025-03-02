
import 'package:flutter/material.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/brand_card.dart';
import '../../common_widgets/sortable_products.dart';
import '../../common_widgets/vertical_product_shimmer.dart';
import '../../constants/sizes.dart';
import '../../controllers/brand_controller.dart';

class BrandProducts extends StatelessWidget {
  const BrandProducts({super.key, required this.brand});

  final brand;

  @override
  Widget build(BuildContext context) {
    final controller = BrandController.instance;
    return Scaffold(
      appBar: CustomAppBar(title: Text(brand),showBackArrorw: true,),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            children: [
              // BrandCard(showBorder: true, brand: brand,),
              SizedBox(height: AppSizes.spaceBtwItems,),
              FutureBuilder(
                future: controller.getBrandProducts(brand),
                builder: (context, snapshot) {
                if(snapshot.connectionState == ConnectionState.waiting){
                return VerticalProductShimmer();
                }else if (snapshot.hasError){
                return Center(child: Text("Something went wrong try again later"),);
                }else if (!snapshot.hasData || snapshot.data!.isEmpty){
                return Center(child: Text("No Product Available"));
                }else {
                  final brandProducts = snapshot.data!;
                  return SortableProducts(products: brandProducts,);
                }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
