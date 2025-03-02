import 'package:agro_ecommerce_flutter/app/common_widgets/product_price_text.dart';
import 'package:agro_ecommerce_flutter/app/common_widgets/product_title_text.dart';
import 'package:agro_ecommerce_flutter/app/common_widgets/rounded_image.dart';
import 'package:agro_ecommerce_flutter/app/controllers/cart_controller.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../models/cart.dart';
import '../utils/helper_functions.dart';
import 'add_remove_button.dart';
import 'brand_title_text_with_icon.dart';


class CartItem extends StatelessWidget {
  const CartItem({
    super.key, required this.cartItem,
  });

  final CartItemModel cartItem;

  @override
  Widget build(BuildContext context) {
    final cartController = CartController.instance;
    return Row(
        children: [
          RoundedImage(
            imageUrl: 'https://via.placeholder.com/180',
            isNetworkImage: true,
            width: 80,
            height: 80,
            padding: EdgeInsets.all(AppSizes.sm),
            bgColor: HelperFunctions.isDarkMode(context) ? AppColors.darkerGrey : AppColors.light,
          ),
          SizedBox(width: AppSizes.spaceBtwItems,),

          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                BrandTitleTextWithIcon(title: cartItem.product!.brand ?? ''),
                ProductTitleText(title: cartItem.product!.name,maxLines: 1,),
                SizedBox(height: AppSizes.spaceBtwItems/1.5,),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ProductQuantityWithAddAndRemoveButton(
                      quantity: cartItem.quantity!,
                      add: ()=> cartController.addOneToCart(cartItem),
                      remove: ()=> cartController.removeOneFromCart(cartItem) ,
                    ),
                    ProductPriceText(price: (cartItem.product!.price * cartItem.quantity!).toStringAsFixed(2)),
                  ],
                ),
                // Text.rich(
                //   TextSpan(
                //     children: (cartItem.selectedVariation ?? {}).entries.map((e) => TextSpan(
                //         children: [
                //           TextSpan(text: e.key,style: Theme.of(context).textTheme.bodySmall),
                //           TextSpan(text: e.value,style: Theme.of(context).textTheme.bodyLarge),
                //         ]
                //     )).toList(),
                //   ),
                // ),
              ],
            ),
          ),
        ],
      );
  }
}
