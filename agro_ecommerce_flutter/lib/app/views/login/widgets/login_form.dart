
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

import '../../../constants/sizes.dart';
import '../../../constants/texts.dart';
import '../../../controllers/login_controller.dart';
import 'package:get/get.dart';

import '../../../utils/validators.dart';
import '../../reset_password/forget_password.dart';
import '../../signup/signup.dart';

class LoginForm extends StatelessWidget {
  const LoginForm({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());
    return Form(
      key: controller.loginFormKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSizes.spaceBtwSections),
        child: Column(
          children: [

            //email
            TextFormField(
              controller: controller.email,
              validator: (value)=> Validators.validateEmail(value),
              decoration: const InputDecoration(
                  prefixIcon: Icon(Iconsax.user),
                  labelText: AppTexts.email
              ),
            ),
            const SizedBox(height: AppSizes.sm,),

            //password
            Obx(
              ()=> TextFormField(
                controller: controller.password,
                validator: (value)=> Validators.validateEmptyText('Password',value),
                obscureText: controller.hidePassword.value,
                decoration: InputDecoration(
                    prefixIcon: Icon(Iconsax.lock_14),
                    suffixIcon:IconButton(
                        onPressed: ()=> controller.hidePassword.value = !controller.hidePassword.value,
                        icon: Icon(controller.hidePassword.value ? Iconsax.eye_slash : Iconsax.eye)
                    ),
                    labelText: AppTexts.password
                ),
              ),
            ),
            const SizedBox(height: AppSizes.spaceBtwInputFields/2,),


            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                    onPressed: ()=> Get.to(()=> const ForgetPassword()),
                    child: const Text(AppTexts.forgetPassword)
                ),
              ],
            ),
            const SizedBox(height: AppSizes.spaceBtwSections,),


            SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                    onPressed: ()=> controller.loginUser(),
                    child: const Text(AppTexts.signIn)
                )
            ),
            const SizedBox(height: AppSizes.spaceBtwItems,),


            SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                    onPressed: ()=>Get.to(()=>const SignupScreen()),
                    child: const Text(AppTexts.createAccount)
                )
            ),
            const SizedBox(height: AppSizes.spaceBtwItems,),
          ],
        ),
      ),
    );
  }
}
