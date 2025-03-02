
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/rounded_container.dart';
import '../../../common_widgets/section_heading.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/checkout_controller.dart';
import '../../../utils/helper_functions.dart';


class BillingPaymentSection extends StatelessWidget {
  const BillingPaymentSection({super.key});

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final controller = Get.put(CheckoutController());
    return Column(
      children: [
        SectionHeading(
          title: 'Payment Method',
          buttonTitle: 'Change',
          onPressed: ()=> controller.selectPaymentMethod(context),
        ),
        SizedBox(height: AppSizes.spaceBtwItems/2,),
           Row(
            children: [
              RoundedContainer(
                width: 60,
                height: 35,
                bgColor: dark ? AppColors.light : AppColors.white,
                padding: EdgeInsets.all(AppSizes.sm),
                child: Image(
                  // image: AssetImage(controller.selectedPaymentMethod.value.image),
                  image: AssetImage('https://via.placeholder.com/180'),
                  fit: BoxFit.contain,
                ),
              ),
              SizedBox(width: AppSizes.spaceBtwItems/2,),
              Text(controller.selectedPaymentMethod,style: Theme.of(context).textTheme.bodyLarge,)
            ],
          ),
      ],
    );
  }
}
