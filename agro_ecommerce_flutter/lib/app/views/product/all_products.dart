
import 'package:agro_ecommerce_flutter/app/models/Product.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/sortable_products.dart';
import '../../common_widgets/vertical_product_shimmer.dart';
import '../../constants/sizes.dart';
import '../../controllers/all_product_controller.dart';


class AllProducts extends StatelessWidget {
  const AllProducts({
    super.key,
    required this.title,
    required this.fetchProducts,
  });

  final String title;
  final Future<List<Product>> Function() fetchProducts;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: Text(title),
        showBackArrorw: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: FutureBuilder(
            future: fetchProducts(),
            builder: (context, snapshot) {
              if(snapshot.connectionState == ConnectionState.waiting){
                return VerticalProductShimmer();
              }else if (snapshot.hasError){
                return Center(child: Text("Something went wrong try again later"),);
              }else if (!snapshot.hasData || snapshot.data!.isEmpty){
                return Center(child: Text("No Product Available"));
              }else{
                final products = snapshot.data!;
                return SortableProducts(products: products,);
              }
            }
          ),
        ),
      ),
    );
  }
}


