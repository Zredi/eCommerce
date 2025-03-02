
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:agro_ecommerce_flutter/app/views/checkout/widgets/billing_address_section.dart';
import 'package:agro_ecommerce_flutter/app/views/checkout/widgets/billing_amount_section.dart';
import 'package:agro_ecommerce_flutter/app/views/checkout/widgets/billing_payment_section.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/rounded_container.dart';
import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';
import '../../controllers/address_controller.dart';
import '../../controllers/cart_controller.dart';
import '../../controllers/order_controller.dart';
import '../../utils/helper_functions.dart';
import '../cart/widgets/cart_items.dart';


class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final cartController = CartController.instance;
    final subTotal = cartController.totalCartPrice.value;
    final orderController = Get.put(OrderController());
    final addressController = AddressController.instance;

    void handleCheckout() {
      if (subTotal <= 0.0) {
        UiUtil.warningSnackBar(
            title: 'Empty Cart!',
            message: 'Add items to cart in order to proceed.'
        );
        return;
      }

      if (addressController.selectedAddress.value.id == null) {
        UiUtil.warningSnackBar(
            title: 'Address Required!',
            message: 'Please select a delivery address to proceed.'
        );
        return;
      }

      orderController.processOrder();
    }

    return Scaffold(
      appBar: CustomAppBar(
        title: Text(
          'Order Review',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        showBackArrorw: true,
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(AppSizes.defaultSpace),
        child: ElevatedButton(
            onPressed: handleCheckout,
            child: Text('Checkout ₹$subTotal')),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            children: [
              CartItems(showAddRemoveButton: false,),
              // SizedBox(height: AppSizes.spaceBtwSections,),
              // PromoCode(),
              SizedBox(height: AppSizes.spaceBtwSections,),
              RoundedContainer(
                showBorder: true,
                padding: EdgeInsets.all(AppSizes.md),
                bgColor: dark ? AppColors.black : AppColors.white,
                child: Column(
                  children: [
                    BillingAmountSection(),
                    SizedBox(height: AppSizes.spaceBtwItems,),
                    Divider(),
                    SizedBox(height: AppSizes.spaceBtwItems,),
                    // BillingPaymentSection(),
                    // SizedBox(height: AppSizes.spaceBtwItems,),
                    BillingAddressSection(),
                    SizedBox(height: AppSizes.spaceBtwItems,),
                    BillingPaymentSection(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

