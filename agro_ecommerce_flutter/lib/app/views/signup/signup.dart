
import 'package:agro_ecommerce_flutter/app/views/signup/widgets/signup_form.dart';
import 'package:flutter/material.dart';

import '../../constants/sizes.dart';
import '../../constants/texts.dart';



class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(AppTexts.signupTitle,style: Theme.of(context).textTheme.headlineMedium,),
              const SizedBox(height: AppSizes.spaceBtwSections,),
              const SignupForm(),
              const SizedBox(height: 15,),
            ],
          ),
        ),
      ),
    );
  }
}

