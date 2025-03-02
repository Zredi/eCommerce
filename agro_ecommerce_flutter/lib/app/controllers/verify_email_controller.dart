

import 'dart:async';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:get/get.dart';

class VerifyEmailController extends GetxController {
  static VerifyEmailController get instance => Get.find();

  @override
  void onInit() {
    super.onInit();
    sendEmailVerification();
    setTimerForAutoRedirect();
  }

  //send email verification link
  sendEmailVerification() async {
    try{
      // await AuthenticationRepository.instance.sendEmailVerification();
      UiUtil.successSnackBar(title: 'Email Send',message: 'Please check your Email and verify.');
    }catch (e){
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }

  //Timer to auto redirect
  setTimerForAutoRedirect(){

  }

  //manually check if email verified
  checkEmailVerificationStatus() async {

  }
}