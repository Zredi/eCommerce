
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

import '../common_widgets/section_heading.dart';
import '../constants/sizes.dart';

class CheckoutController extends GetxController{
  static CheckoutController get instance => Get.find();

  // final Rx<PaymentMethodModel> selectedPaymentMethod = PaymentMethodModel.empty().obs;
  final selectedPaymentMethod = "Cash On Delivery";

  @override
  void onInit() {
    super.onInit();
    // selectedPaymentMethod.value = PaymentMethodModel(name: 'GPay', image: MyImages.google);
  }

  Future<dynamic> selectPaymentMethod(BuildContext context){
    return showModalBottomSheet(
      context: context,
      builder: (context) => SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(AppSizes.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SectionHeading(title: 'Select payment method',showActionButton: false,),
              SizedBox(height: AppSizes.spaceBtwSections,),
              // PaymentTile(paymentMethod: PaymentMethodModel(name: 'GPay', image: MyImages.google)),
              SizedBox(height: AppSizes.spaceBtwItems/2,),
              SizedBox(height: AppSizes.spaceBtwSections,),
            ],
          ),
        ),
      ),
    );
  }
}