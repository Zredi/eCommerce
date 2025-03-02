import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../constants/app_colors.dart';
import '../controllers/cart_controller.dart';
import '../utils/helper_functions.dart';
import '../views/cart/cart_screen.dart';


class CartCounterIcon extends StatelessWidget {
  const CartCounterIcon({
    super.key,
    this.iconColor,
    this.counterBgColor,
    this.counterTextColor,
  });

  final Color? iconColor, counterBgColor, counterTextColor;

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final controller = Get.put(CartController());
    return Stack(
      children: [
        IconButton(onPressed: ()=> Get.to(()=> CartScreen()), icon: Icon(Iconsax.shopping_bag5,color: iconColor,)),
        Positioned(
          right: 0,
          child: Container(
            width: 15,
            height: 15,
            decoration: BoxDecoration(
                color: counterBgColor ?? (dark ? AppColors.white : AppColors.black),
                borderRadius: BorderRadius.circular(100)
            ),
            child: Center(
              child: Obx(
                ()=> Text(
                  controller.noOfCartItems.value.toString(),
                  style: Theme.of(context).textTheme.labelLarge!.apply(
                      color: counterTextColor ?? (dark ? AppColors.black : AppColors.white),
                      fontSizeFactor: 0.8
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
