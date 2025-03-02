
import 'package:agro_ecommerce_flutter/app/services/auth_service.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../bottom_navigation_menu.dart';
import '../views/login/login.dart';
import '../views/onboarding/onboarding.dart';

class AuthController extends GetxController{
  static AuthController get instance => Get.find();

  final deviceStorage = GetStorage();
  final AuthService authService = AuthService();

  @override
  void onReady() {
    super.onReady();
    screenRedirect();
  }

  Future<void> screenRedirect()async{
    bool isAuthenticated = await authService.isAuthenticated();
    if(isAuthenticated){
      Get.offAll(()=> NavigationMenu());
      return;
    }

    bool isFirstTime = deviceStorage.read('isFirstTime') ?? true;

    if(isFirstTime){
      Get.offAll(()=> OnboardingScreen());
    }else{
      Get.offAll(()=> LoginScreen());
    }
  }

}