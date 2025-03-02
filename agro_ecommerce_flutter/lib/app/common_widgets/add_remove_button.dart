import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../utils/helper_functions.dart';
import 'circular_icon.dart';


class ProductQuantityWithAddAndRemoveButton extends StatelessWidget {
  const ProductQuantityWithAddAndRemoveButton({
    super.key, required this.quantity, this.add, this.remove,
  });

  final int quantity;
  final VoidCallback? add,remove;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircularIcon(
          icon: Iconsax.minus,
          width: 30,
          height: 30,
          size: AppSizes.md,
          color: HelperFunctions.isDarkMode(context) ? AppColors.white : AppColors.white,
          bgColor: HelperFunctions.isDarkMode(context) ? AppColors.secondary : AppColors.secondary,
          onPressed: remove,
        ),
        SizedBox(width: AppSizes.spaceBtwItems,),
        Text(quantity.toString(),style: Theme.of(context).textTheme.titleSmall,),
        SizedBox(width: AppSizes.spaceBtwItems,),
        CircularIcon(
          icon: Iconsax.add,
          width: 30,
          height: 30,
          size: AppSizes.md,
          color: AppColors.white,
          bgColor: AppColors.primary,
          onPressed: add,
        ),
      ],
    );
  }
}
