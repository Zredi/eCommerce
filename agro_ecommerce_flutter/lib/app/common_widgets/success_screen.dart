import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../constants/sizes.dart';
import '../constants/spacing_style.dart';
import '../constants/texts.dart';
import '../utils/helper_functions.dart';



class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key, required this.image, required this.title, required this.subTitle, required this.onPressed});

  final String image, title, subTitle;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: AppSpacingStyle.paddingWithAppbarHeight * 2,
          child: Column(
            children: [
              Lottie.asset(image,width: HelperFunctions.screenWidth()*0.6,),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              Text(title, style: Theme.of(context).textTheme.headlineMedium, textAlign: TextAlign.center,),
              const SizedBox(height: AppSizes.spaceBtwItems,),
              Text(subTitle,style: Theme.of(context).textTheme.labelMedium,textAlign: TextAlign.center,),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              SizedBox(width: double.infinity,child: ElevatedButton(onPressed: onPressed,child: const Text(AppTexts.continueBtn),),),
            ],
          ),
        ),
      ),
    );
  }
}
