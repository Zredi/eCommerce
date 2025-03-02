
import 'dart:async';
import 'package:agro_ecommerce_flutter/app/services/auth_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

import '../constants/app_images.dart';
import '../models/user_model.dart';
import '../views/login/login.dart';
import '../views/signup/verify_email.dart';
import 'network_controller.dart';

class SignupController extends GetxController {
  static SignupController get instance => Get.find();

  final hidePassword = true.obs;
  final privacyPolicy = true.obs;
  final email = TextEditingController();
  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final password = TextEditingController();
  final phoneNumber = TextEditingController();
  GlobalKey<FormState> signupFormKey = GlobalKey<FormState>();
  final AuthService authService = AuthService();
  final networkManager = Get.put(NetworkManager());


  Future<void> signup() async {

    try{
      UiUtil.openLoadingDialog('We are processing your information...', AppImages.loadingAnimation);

      final isConnected = await networkManager.isConnected();
      if(!isConnected){
        UiUtil.stopLoading();
        return;
      }

      if(!signupFormKey.currentState!.validate()){
        UiUtil.stopLoading();
        return;
      }

      if(!privacyPolicy.value){
        UiUtil.stopLoading();
        UiUtil.warningSnackBar(
            title: 'Accept Privacy Policy',
            message: 'In order to create account, you must accept the Privacy Policy & Terms of use.'
        );
        return;
      }

      final newUser = UserModel(
        firstName: firstName.text.trim(),
        lastName: lastName.text.trim(),
        email: email.text.trim(),
        password: password.text.trim(),
        phoneNo: phoneNumber.text.trim(),
      );

      await authService.signupUser(newUser);

      UiUtil.stopLoading();

      UiUtil.successSnackBar(
          title: 'Congratulations',
          message: 'Your account has been created. Login to continue.',
      );

      Get.offAll(()=> LoginScreen());

    }catch(e) {
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }
}


