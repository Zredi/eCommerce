import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/add_remove_button.dart';
import '../../../common_widgets/brand_title_text_with_icon.dart';
import '../../../common_widgets/cart_item.dart';
import '../../../common_widgets/product_price_text.dart';
import '../../../common_widgets/product_title_text.dart';
import '../../../common_widgets/rounded_image.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/cart_controller.dart';
import '../../../utils/helper_functions.dart';


class CartItems extends StatelessWidget {
  const CartItems({
    super.key, this.showAddRemoveButton = true,
  });

  final bool showAddRemoveButton;

  @override
  Widget build(BuildContext context) {
    final cartController = CartController.instance;
    return Obx(
          () =>
          ListView.separated(
            shrinkWrap: true,
            itemCount: cartController.cartItems.length,
            separatorBuilder: (context, index) => SizedBox(height: AppSizes.spaceBtwSections,),
            itemBuilder: (context, index) =>
                Obx(() {
                  final item = cartController.cartItems[index];
                  final String productImage = item.product!.images.isNotEmpty
                      ? "http://192.168.9.209:9000${item.product!.images[0].downloadUrl}" : 'https://via.placeholder.com/180';
                  return Column(
                    key: ValueKey(item.id),
                    children: [
                      Row(
                        children: [
                          RoundedImage(
                            imageUrl: productImage,
                            isNetworkImage: true,
                            width: showAddRemoveButton ? 80 : 50,
                            height: showAddRemoveButton ? 80 : 50,
                            padding: EdgeInsets.all(AppSizes.sm),
                            bgColor: HelperFunctions.isDarkMode(context) ? AppColors.darkerGrey : AppColors.light,
                          ),
                          SizedBox(width: AppSizes.spaceBtwItems,),

                          Expanded(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                BrandTitleTextWithIcon(title: item.product!.brand ?? ''),
                                ProductTitleText(title: item.product!.name,maxLines: 1,),
                                SizedBox(height: AppSizes.spaceBtwItems/1.5,),

                                if(showAddRemoveButton)
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    ProductQuantityWithAddAndRemoveButton(
                                      quantity: item.quantity!,
                                      add: ()=> cartController.addOneToCart(item),
                                      remove: ()=> cartController.removeOneFromCart(item) ,
                                    ),
                                    ProductPriceText(price: (item.product!.price * item.quantity!).toStringAsFixed(2)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                         ]
                      ),
                     ]
                  );
                 }
                ),
          ),
    );
  }
}
