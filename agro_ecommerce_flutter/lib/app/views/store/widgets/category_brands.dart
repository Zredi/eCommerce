import 'package:flutter/material.dart';

import '../../../common_widgets/boxes_shimmer.dart';
import '../../../common_widgets/brand_showcase.dart';
import '../../../common_widgets/listTile_shimmer.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/brand_controller.dart';
import '../../../models/Category.dart';

class CategoryBrands extends StatelessWidget {
  const CategoryBrands({super.key, required this.category});

  final Category category;

  @override
  Widget build(BuildContext context) {
    final controller = BrandController.instance;
    return FutureBuilder(
      future: controller.getBrandsOfCategory(category.name),
      builder: (context, snapshot) {
        final brands = snapshot.data!;
        return ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3,
          itemBuilder: (context, index) {
            final brand = brands[index];
            return FutureBuilder(
              future: controller.getBrandProducts(brand),
              builder: (context, snapshot) {
                final products = snapshot.data!;
                return BrandShowCase(images: products.map((e) => e.name).toList(), brand: brand,);
              }
            );
          },
        );
      }
    );
  }
}
