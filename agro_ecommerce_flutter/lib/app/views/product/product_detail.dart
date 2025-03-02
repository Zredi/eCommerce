import 'package:agro_ecommerce_flutter/app/controllers/cart_controller.dart';
import 'package:agro_ecommerce_flutter/app/controllers/stock_controller.dart';
import 'package:agro_ecommerce_flutter/app/models/cart.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:agro_ecommerce_flutter/app/views/product/widgets/bottom_add_to_cart.dart';
import 'package:agro_ecommerce_flutter/app/views/product/widgets/product_data.dart';
import 'package:agro_ecommerce_flutter/app/views/product/widgets/product_detail_image_slider.dart';
import 'package:agro_ecommerce_flutter/app/views/product/widgets/product_rating.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:iconsax/iconsax.dart';
import 'package:readmore/readmore.dart';

import '../../common_widgets/section_heading.dart';
import '../../constants/sizes.dart';
import '../../models/Product.dart';
import '../checkout/checkout.dart';

class ProductDetail extends StatelessWidget {
  const ProductDetail({super.key, required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final cartController = CartController.instance;
    final stockController = StockController.instance;
    // stockController.fetchStockByProductId(product.id);

    Future<void> directCheckout()async{
      try{
        final cartId = cartController.userController.user.value.cart!.cartId;
        await cartController.clearCart(cartId);
        await cartController.addItemToCart(product.id, 1);
        await cartController.fetchCart();
        Get.to(()=> CheckoutScreen());
      }catch(e){
        UiUtil.errorSnackBar(title: "Checkout Failed", message: e.toString());
      }
    }
    return Scaffold(
      bottomNavigationBar: BottomAddToCart(product: product),
      body: SingleChildScrollView(
        child: Column(
          children: [
            ProductImageSlider(product: product,),

            Padding(
                padding: EdgeInsets.only(right: AppSizes.defaultSpace,left: AppSizes.defaultSpace,bottom: AppSizes.defaultSpace),
                child: Column(
                  children: [
                    // ProductRating(),

                    ProductData(product: product,),
                    SizedBox(height: AppSizes.spaceBtwSections,),
                    SizedBox(
                      width: double.infinity,
                      child: Obx(
                            () {
                          final stock = stockController.getStock(product.id);
                          if(stock == null){
                            return ElevatedButton(
                              onPressed: (){UiUtil.warningSnackBar(title: "${product.name} is not available",message: "Currently out of stock!");},
                              child: Text('Checkout'),
                            );
                          }
                          return ElevatedButton(
                            onPressed: stock.currentStock > 0 ? directCheckout : null,
                            child: Text(stock.currentStock > 0 ? 'Checkout':'Out of stock'),
                          );
                        },
                      ),
                    ),
                    SizedBox(height: AppSizes.spaceBtwItems,),
                    SectionHeading(title: 'Description',showActionButton: false,),
                    SizedBox(height: AppSizes.spaceBtwItems,),
                    ReadMoreText(
                      product.description ?? '',
                      trimLines: 2,
                      trimMode: TrimMode.Line,
                      trimCollapsedText: ' Show more',
                      trimExpandedText: ' Show less',
                      moreStyle: TextStyle(fontSize: 14,fontWeight: FontWeight.w800),
                      lessStyle: TextStyle(fontSize: 14,fontWeight: FontWeight.w800),
                    ),
                    // Divider(),
                    // SizedBox(height: AppSizes.spaceBtwItems,),
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    //   children: [
                    //     SectionHeading(title: 'Reviews (199)',showActionButton: false,),
                    //     IconButton(onPressed: ()=> Get.to(()=> ProductReviewScreen()), icon: Icon(Iconsax.arrow_right_3,size: 18,)),
                    //   ],
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


