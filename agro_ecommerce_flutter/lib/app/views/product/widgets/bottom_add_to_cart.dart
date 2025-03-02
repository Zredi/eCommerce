
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../../common_widgets/circular_icon.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/cart_controller.dart';
import '../../../controllers/stock_controller.dart';
import '../../../models/Product.dart';
import '../../../utils/helper_functions.dart';

class BottomAddToCart extends StatelessWidget {
  const BottomAddToCart({super.key, required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final controller = CartController.instance;
    final stockController = StockController.instance;
    // controller.updateAlreadyAddedProductCount(product);
    return Container(
      padding: EdgeInsets.symmetric(horizontal: AppSizes.defaultSpace,vertical: AppSizes.defaultSpace/2),
      decoration: BoxDecoration(
        color: dark ? AppColors.darkerGrey : AppColors.light,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppSizes.cardRadiusLg),
          topRight: Radius.circular(AppSizes.cardRadiusLg),
        ),
      ),
      child: Obx(
        ()=> Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
             Row(
                children: [
                  CircularIcon(
                      icon: Iconsax.minus,
                      bgColor: AppColors.secondary,
                      width: 40,
                      height: 40,
                      color: AppColors.white,
                      onPressed: controller.productQuantityInCart.value > 0
                                 ? ()async{
                        if(controller.productQuantityInCart.value > 0){
                          controller.productQuantityInCart.value -= 1;
                        }
                      } : null,
                  ),
                  SizedBox(width: AppSizes.spaceBtwItems,),
                  Text(controller.productQuantityInCart.value.toString(),style: Theme.of(context).textTheme.titleSmall,),
                  SizedBox(width: AppSizes.spaceBtwItems,),
                  CircularIcon(
                    icon: Iconsax.add,
                    bgColor: AppColors.primary,
                    width: 40,
                    height: 40,
                    color: AppColors.white,
                    onPressed: ()=> controller.productQuantityInCart.value += 1,
                  ),
                ],
              ),
            ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.all(AppSizes.md),
                  backgroundColor: AppColors.black,
                ),
                onPressed: ()async{
                  final stock = stockController.getStock(product.id);
                  final quantity = controller.productQuantityInCart.value;
                  if(stock == null || stock.currentStock < 1){
                    UiUtil.warningSnackBar(title: "${product.name} is not available",message: "Currently out of stock!");
                  }else{
                    if(quantity > 0){
                      await controller.addItemToCart(product.id, quantity);
                      UiUtil.customToast(message: "${product.name} added to cart");
                    }else{
                      UiUtil.warningSnackBar(title: "Quantity required",message: "Please select a valid quantity");
                    }
                  }
                },
                child: Text('Add to Cart')
            )
          ],
        ),
      ),
    );
  }
}
