import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../constants/texts.dart';
import '../../../controllers/signup_controller.dart';
import '../../../utils/helper_functions.dart';



class TermsAndConditionCheckbox extends StatelessWidget {
  const TermsAndConditionCheckbox({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = SignupController.instance;
    final dark = HelperFunctions.isDarkMode(context);
    return Row(
      children: [
        SizedBox(width: 24,child: Obx(()=> Checkbox(
            value: controller.privacyPolicy.value,
            onChanged: (value)=> controller.privacyPolicy.value = !controller.privacyPolicy.value))
        ),
        const SizedBox(width: AppSizes.spaceBtwItems,),
        Text.rich(
            TextSpan(
              children: [
                TextSpan(text: '${AppTexts.iAgreeTo} ',style: Theme.of(context).textTheme.bodySmall),
                TextSpan(text: AppTexts.privacyPolicy,style: Theme.of(context).textTheme.bodyMedium!.apply(
                  color: dark ? AppColors.white : AppColors.primary,
                  decoration: TextDecoration.underline,
                  decorationColor: dark ? AppColors.white : AppColors.primary,
                )
                ),
                TextSpan(text: ' and ',style: Theme.of(context).textTheme.bodySmall),
                TextSpan(text: AppTexts.termsOfUse,style: Theme.of(context).textTheme.bodyMedium!.apply(
                  color: dark ? AppColors.white : AppColors.primary,
                  decoration: TextDecoration.underline,
                  decorationColor: dark ? AppColors.white : AppColors.primary,
                )
                ),
              ],
            )
        ),
      ],
    );
  }
}
