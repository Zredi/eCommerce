
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../constants/app_images.dart';
import '../../constants/sizes.dart';
import '../../constants/texts.dart';
import '../../controllers/forget_password_controller.dart';
import '../../utils/helper_functions.dart';
import '../login/login.dart';


class ResetPassword extends StatelessWidget {
  const ResetPassword({super.key, required this.email});

  final String email;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        actions: [
          IconButton(onPressed: ()=>Get.back(), icon: Icon(CupertinoIcons.clear))
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            children: [
              Image(image: AssetImage(AppImages.deliveredEmail),width: HelperFunctions.screenWidth()*0.6,),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              Text(email, style: Theme.of(context).textTheme.bodyMedium,textAlign: TextAlign.center,),
              const SizedBox(height: AppSizes.spaceBtwItems,),
              Text(AppTexts.changePasswordTitle, style: Theme.of(context).textTheme.headlineMedium, textAlign: TextAlign.center,),
              const SizedBox(height: AppSizes.spaceBtwItems,),
              Text(AppTexts.changePasswordSubTitle,style: Theme.of(context).textTheme.labelMedium,textAlign: TextAlign.center,),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: ()=> Get.offAll(LoginScreen()),
                  child: const Text(AppTexts.continueBtn),
                ),
              ),
              const SizedBox(height: AppSizes.spaceBtwItems,),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: ()=> ForgetPasswordController.instance.resendPasswordResetEmail(email),
                  child: const Text(AppTexts.resendEmail),
                ),
              ),

            ],
          ),
        ),
      ),
    );
  }
}
