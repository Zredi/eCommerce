
import 'package:agro_ecommerce_flutter/app/utils/validators.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../constants/sizes.dart';
import '../../constants/texts.dart';
import '../../controllers/forget_password_controller.dart';

class ForgetPassword extends StatelessWidget {
  const ForgetPassword({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ForgetPasswordController());
    return Scaffold(
      appBar: AppBar(),
      body: Padding(
          padding: const EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(AppTexts.forgetPasswordTitle,style: Theme.of(context).textTheme.headlineMedium,),
              const SizedBox(height: AppSizes.spaceBtwItems,),
              Text(AppTexts.forgetPasswordSubTitle,style: Theme.of(context).textTheme.labelMedium,),
              const SizedBox(height: AppSizes.spaceBtwSections * 2,),

              Form(
                key: controller.forgetPasswordFormKey,
                child: TextFormField(
                  controller: controller.email,
                  validator: Validators.validateEmail,
                  decoration: const InputDecoration(
                    labelText: AppTexts.email,
                    prefixIcon: Icon(Iconsax.direct_right),
                  ),
                ),
              ),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              SizedBox(
                  width:double.infinity,
                  child: ElevatedButton(
                      onPressed: ()=> controller.sendPasswordResetEmail(),
                      child: const Text(AppTexts.submit)
                  )
              )
            ],
          ),
      ),
    );
  }
}
