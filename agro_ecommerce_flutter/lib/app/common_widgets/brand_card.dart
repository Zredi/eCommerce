import 'package:agro_ecommerce_flutter/app/common_widgets/rounded_container.dart';
import 'package:flutter/material.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../models/enums.dart';
import '../utils/helper_functions.dart';
import 'brand_title_text_with_icon.dart';
import 'circular_image.dart';

class BrandCard extends StatelessWidget {
  const BrandCard({
    super.key, required this.showBorder, this.onTap, required this.brand,
  });

  final bool showBorder;
  final void Function()? onTap;
  final brand;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: RoundedContainer(
        padding: EdgeInsets.all(AppSizes.sm),
        showBorder: showBorder,
        bgColor: Colors.transparent,
        child: Row(
          children: [
            SizedBox(width: AppSizes.spaceBtwItems/2,),

            //text
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BrandTitleTextWithIcon(title: brand,brandTextSize: TextSizes.large,),
                  // Text(
                  //   '${brand.productcount} products',
                  //   overflow: TextOverflow.ellipsis,
                  //   style: Theme.of(context).textTheme.labelMedium,
                  // ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
