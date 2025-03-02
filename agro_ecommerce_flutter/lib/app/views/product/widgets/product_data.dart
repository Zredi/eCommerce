
import 'package:agro_ecommerce_flutter/app/controllers/stock_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../../common_widgets/brand_title_text_with_icon.dart';
import '../../../common_widgets/circular_image.dart';
import '../../../common_widgets/product_price_text.dart';
import '../../../common_widgets/product_title_text.dart';
import '../../../common_widgets/rounded_container.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/product_controller.dart';
import '../../../models/Product.dart';
import '../../../models/enums.dart';
import '../../../utils/helper_functions.dart';



class ProductData extends StatelessWidget {
  const ProductData({super.key, required this.product});

  final Product product;
  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final stockController = StockController.instance;
    // stockController.fetchStockByProductId(product.id);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ProductTitleText(title: product.name),
            ProductPriceText(price: "${product.price}",isLarge: true,),
          ],
        ),
        SizedBox(height: AppSizes.spaceBtwItems/1.5,),
        BrandTitleTextWithIcon(title: product.brand != null ? product.brand : '',brandTextSize: TextSizes.medium,),
        SizedBox(height: AppSizes.spaceBtwItems/1.5,),

        Obx((){
          final stock = stockController.getStock(product.id);
          if(stock == null){
            return Text("Out of stock",
              style: Theme.of(context).textTheme.titleMedium!.copyWith(color: Colors.red),);
          } else if(stock.currentStock < 1){
            return Text(
              "Out of stock",
              style: Theme.of(context).textTheme.titleMedium!.copyWith(color: Colors.red),
            );
          }else if(stock.currentStock < 10){
            return Text(
              "Order soon! Only few left",
              style: Theme.of(context).textTheme.titleMedium!.copyWith(color: AppColors.secondary),
            );
          }else{
            return Text(
              "In stock",
              style: Theme.of(context).textTheme.titleMedium!.copyWith(color: AppColors.primary),
            );
          }
        })
        // if (stockController.stock.value.currentStock < 1)
        //   Text(
        //     "Out of stock",
        //     style: Theme.of(context).textTheme.titleMedium!.copyWith(color: Colors.red),
        //   )
        // else if (product.stock < 10)
        //   Text(
        //     "Order soon! Only few left",
        //     style: Theme.of(context).textTheme.titleMedium!.copyWith(color: AppColors.secondary),
        //   )
        // else
        //   Text(
        //     "In stock",
        //     style: Theme.of(context).textTheme.titleMedium!.copyWith(color: AppColors.primary),
        //   ),
        // SizedBox(height: AppSizes.spaceBtwItems/1.5,),

      ],
    );
  }
}
