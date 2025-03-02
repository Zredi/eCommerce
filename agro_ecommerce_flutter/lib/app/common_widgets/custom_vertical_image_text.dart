import 'package:flutter/material.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../utils/helper_functions.dart';
import 'circular_image.dart';

class CustomVerticalImageText extends StatelessWidget {
  const CustomVerticalImageText({
    super.key,
    // required this.image,
    required this.title,
    this.textColor = AppColors.white,
    this.bgColor,
    this.onTap,
    // this.isNetworkImage = true,
  });

  // final String image;
  final String title;
  final Color textColor;
  final Color? bgColor;
  // final bool isNetworkImage;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.only(right:AppSizes.spaceBtwItems),
        child: Column(
          children: [
            // CircularImage(
            //   image: image,
            //   fit: BoxFit.contain,
            //   padding: AppSizes.sm * 1,
            //   isNetworkImage: isNetworkImage,
            //   bgColor: bgColor,
            //   overlayColor: dark ? AppColors.light : AppColors.dark,
            // ),
            const SizedBox(height: AppSizes.spaceBtwItems/2,),
            Text(title,style: Theme.of(context).textTheme.labelMedium!.apply(color: textColor),)
          ],
        ),
      ),
    );
  }
}
