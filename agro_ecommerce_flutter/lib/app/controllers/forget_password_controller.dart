
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

import '../constants/app_images.dart';
import '../views/reset_password/reset_password.dart';


class ForgetPasswordController extends GetxController {
  static ForgetPasswordController get instance => Get.find();

  final email = TextEditingController();
  GlobalKey<FormState> forgetPasswordFormKey = GlobalKey<FormState>();

  //send reset password email
  sendPasswordResetEmail() async {
    try{
      UiUtil.openLoadingDialog('Processing your request...', AppImages.loadingAnimation);
      //check internet
      // final isConnected = await NetworkManager.instance.isConnected();
      // if(!isConnected){
      //   FullScreenLoader.stopLoading();
      //   return;
      // }
      //form validation
      if(!forgetPasswordFormKey.currentState!.validate()){
        UiUtil.stopLoading();
        return;
      }

      // await AuthenticationRepository.instance.sendPasswordResetEmail(email.text.trim());
      UiUtil.stopLoading();
      UiUtil.successSnackBar(title: 'Email Sent',message: 'Email link sent for reset password.');
      Get.to(()=> ResetPassword(email: email.text.trim()));
    }catch(e){
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }

  resendPasswordResetEmail(String email) async {
    try{
      UiUtil.openLoadingDialog('Processing your request...', AppImages.loadingAnimation);
      //check internet
      // final isConnected = await NetworkManager.instance.isConnected();
      // if(!isConnected){
      //   UiUtil.stopLoading();
      //   return;
      // }


      // await AuthenticationRepository.instance.sendPasswordResetEmail(email);
      UiUtil.stopLoading();
      UiUtil.successSnackBar(title: 'Email Sent',message: 'Email link sent for reset password.');
    }catch(e){
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }
}