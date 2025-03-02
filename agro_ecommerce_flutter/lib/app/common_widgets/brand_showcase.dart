import 'package:agro_ecommerce_flutter/app/common_widgets/rounded_container.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../utils/helper_functions.dart';
import '../views/brand/brand_products.dart';
import 'brand_card.dart';
import 'custom_shimmer_effect.dart';

class BrandShowCase extends StatelessWidget {
  const BrandShowCase({
    super.key, required this.images, required this.brand,
  });

  final brand;
  final List<String> images;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: ()=> Get.to(()=> BrandProducts(brand: brand)),
      child: RoundedContainer(
        showBorder: true,
        borderColor: AppColors.darkGrey,
        bgColor: Colors.transparent,
        padding: EdgeInsets.all(AppSizes.md),
        margin: EdgeInsets.only(bottom: AppSizes.spaceBtwItems),
        child: Column(
          children: [
            BrandCard(showBorder: false, brand: brand,),
            Row(
              children: images.map((image) => brandTopProductImageWidget(image, context)).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

Widget brandTopProductImageWidget(String image, context){
  return Expanded(
    child: RoundedContainer(
      height: 100,
      bgColor: HelperFunctions.isDarkMode(context) ? AppColors.darkerGrey : AppColors.light,
      margin: EdgeInsets.all(AppSizes.sm),
      child: CachedNetworkImage(
        fit: BoxFit.contain,
        imageUrl: image,
        progressIndicatorBuilder: (context, url, progress) => CustomShimmerEffetct(width: 100, height: 100),
        errorWidget: (context, url, error) => Icon(Icons.error),
      )
    ),
  );
}