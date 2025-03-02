import 'package:agro_ecommerce_flutter/app/common_widgets/rounded_container.dart';
import 'package:agro_ecommerce_flutter/app/controllers/cart_controller.dart';
import 'package:agro_ecommerce_flutter/app/controllers/stock_controller.dart';
import 'package:agro_ecommerce_flutter/app/models/Product.dart';
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:agro_ecommerce_flutter/app/views/product/product_detail.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../constants/app_colors.dart';
import '../constants/shadows.dart';
import '../constants/sizes.dart';
import '../utils/helper_functions.dart';

class ProductCardVertical extends StatelessWidget {
  const ProductCardVertical({super.key, required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final baseUrl = HttpHelper.baseUrl.replaceAll('/api/v1', '');
    final dark = HelperFunctions.isDarkMode(context);
    final cartController = CartController.instance;
    final stockController = Get.put(StockController());
    stockController.fetchStockByProductId(product.id);
    final String productImage = product.images.isNotEmpty
      ? "$baseUrl${product.images[0].downloadUrl}" : 'https://via.placeholder.com/180';
    return GestureDetector(
      onTap: ()=> Get.to(()=> ProductDetail(product: product)),
      child: Container(
        width: 180,
        decoration: BoxDecoration(
          boxShadow: [ShadowStyle.verticalProductShadow],
          borderRadius: BorderRadius.circular(AppSizes.productImageRadius),
          color: dark ? AppColors.darkerGrey : AppColors.white,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RoundedContainer(
              height: 180,
              width: 180,
              padding: const EdgeInsets.all(AppSizes.sm),
              bgColor: dark ? AppColors.dark : AppColors.light,
              child: Center(
                child: Image.network(
                  productImage,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: AppSizes.spaceBtwItems / 3),

            Padding(
              padding: const EdgeInsets.only(left: AppSizes.sm),
              child: SizedBox(
                width: double.infinity,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: AppSizes.spaceBtwItems / 4),
                    Text(
                      product.brand,
                      style: TextStyle(fontWeight: FontWeight.w500,overflow: TextOverflow.ellipsis),
                    ),
                  ],
                ),
              ),
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: AppSizes.sm),
                  child: Text(
                    "₹ ${product.price}",
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.secondary,
                      fontSize: 16,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: (){
                    final stock = stockController.getStock(product.id);
                    if(stock == null || stock.currentStock < 1){
                      UiUtil.warningSnackBar(title: "${product.name} is not available",message: "Currently out of stock!");
                    }else {
                      cartController.addItemToCart(product.id, 1);
                      UiUtil.customToast(
                          message: "${product.name} added to cart");
                    }
                  },
                  icon: const Icon(Icons.add_shopping_cart,color: AppColors.primary,),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
