import 'package:agro_ecommerce_flutter/app/bottom_navigation_menu.dart';
import 'package:agro_ecommerce_flutter/app/controllers/auth_controller.dart';
import 'package:agro_ecommerce_flutter/app/services/auth_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:agro_ecommerce_flutter/app/views/login/login.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../constants/app_images.dart';
import 'network_controller.dart';

class LoginController extends GetxController{
  static LoginController get instance => Get.find();

  GlobalKey<FormState> loginFormKey = GlobalKey<FormState>();
  final email = TextEditingController();
  final password = TextEditingController();
  final hidePassword = true.obs;
  final AuthService authService = AuthService();
  final networkManager = Get.put(NetworkManager());

  Future<void> loginUser()async{
    try{
      UiUtil.openLoadingDialog('Logging you in...', AppImages.loadingAnimation);

      final isConnected = await networkManager.isConnected();
      if(!isConnected){
        UiUtil.stopLoading();
        return;
      }

      if(!loginFormKey.currentState!.validate()){
        UiUtil.stopLoading();
        return;
      }

      final result = await authService.login(email.text, password.text);

      print("result: $result");

      if(result['success']) {
        UiUtil.stopLoading();
        AuthController.instance.screenRedirect();
      }else{
        UiUtil.stopLoading();
        UiUtil.errorSnackBar(title: 'Incorrect email or password!',message: 'Please check your email and password.');
      }
    }catch(e){
      print(e);
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'Incorrect email or password!',message: 'Please check your email and password.');
    }
    // if(loginFormKey.currentState!.validate()){
    //   final result = await authService.login(email.text, password.text);
    //   if(result['success']){
    //     Get.offAll(()=> NavigationMenu());
    //   }else{
    //     UiUtil.errorSnackBar(title: 'Error', message: result['message']);
    //   }
    // }
  }

  Future<void> logoutUser()async{
    await authService.logout();
    Get.offAll(()=> LoginScreen());
  }
}