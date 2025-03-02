import 'package:agro_ecommerce_flutter/app/views/cart/widgets/cart_items.dart';
import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../../bottom_navigation_menu.dart';
import '../../common_widgets/animation_loader.dart';
import '../../common_widgets/appbar.dart';
import '../../constants/app_images.dart';
import '../../constants/sizes.dart';
import '../../controllers/cart_controller.dart';
import '../checkout/checkout.dart';


class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final controller = Get.put(CartController());

    return Scaffold(
      appBar: CustomAppBar(
        title: Text('Cart',style: Theme.of(context).textTheme.headlineSmall,),
        showBackArrorw: true,
      ),
      bottomNavigationBar: Obx(()=>controller.cartItems.isEmpty ? SizedBox() : Padding(
        padding: const EdgeInsets.all(AppSizes.defaultSpace),
        child: ElevatedButton(
            onPressed: ()=> Get.to(()=> CheckoutScreen()),
            child: Text('Checkout  ₹${controller.totalCartPrice.value}')
        ),
      ),
      ),
      body: Obx(() {
        final emptyWidget = AnimationLoaderWidget(
          text: 'Cart is Empty!',
          animation: AppImages.emptyCart,
          showAction: true,
          actionText: 'Let\'s add items',
          onActionPressed: ()=> Get.off(()=> NavigationMenu()),
        );
        return controller.cartItems.isEmpty ? emptyWidget :
        SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(AppSizes.defaultSpace),
            child: CartItems(),
          ),
        );
      }
      ),
    );
  }
}
