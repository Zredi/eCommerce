import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../controllers/cart_controller.dart';


class ProductCardAddToCartButton extends StatelessWidget {
  const ProductCardAddToCartButton({
    super.key, required this.product,
  });

  final product;

  @override
  Widget build(BuildContext context) {
    final cartController = CartController.instance;
    return InkWell(
      onTap: (){

      },
      child: Obx(
          () {
            final productQuantityInCart = 5;
            return Container(
              decoration: BoxDecoration(
                  color: productQuantityInCart > 0 ? AppColors.primary : AppColors.dark,
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(AppSizes.cardRadiusMd),
                      bottomRight: Radius.circular(AppSizes.productImageRadius)
                  )
              ),
              child: SizedBox(
                  width: AppSizes.iconLg * 1.2,
                  height: AppSizes.iconLg * 1.2,
                  child: Center(
                      child: productQuantityInCart > 0 ?
                      Text(productQuantityInCart.toString(), style: Theme.of(context).textTheme.bodyLarge!.apply(color: AppColors.white),) :
                      Icon(Iconsax.add, color: AppColors.white,))
              ),
            );
          }
      ),
    );
  }
}