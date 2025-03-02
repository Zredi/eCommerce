import 'package:agro_ecommerce_flutter/app/routes/routes.dart';
import 'package:agro_ecommerce_flutter/app/views/order/order_screen.dart';
import 'package:get/get.dart';

import '../views/cart/cart_screen.dart';
import '../views/home/home_screen.dart';
import '../views/login/login.dart';
import '../views/onboarding/onboarding.dart';
import '../views/profile/profile.dart';
import '../views/reset_password/forget_password.dart';
import '../views/settings/setting_screen.dart';
import '../views/signup/signup.dart';
import '../views/signup/verify_email.dart';
import '../views/store/store_screen.dart';

class AppRoutes {
  static final pages = [
    GetPage(name: CustomRoutes.home, page: ()=> HomeScreen()),
    GetPage(name: CustomRoutes.store, page: ()=> StoreScreen()),
    GetPage(name: CustomRoutes.favorites, page: ()=> OrderScreen()),
    GetPage(name: CustomRoutes.settings, page: ()=> SettingsScreen()),
    // GetPage(name: CustomRoutes.productReviews, page: ()=> ProductReviewScreen()),
    GetPage(name: CustomRoutes.order, page: ()=> OrderScreen()),
    // GetPage(name: CustomRoutes.checkout, page: ()=> CheckoutScreen()),
    GetPage(name: CustomRoutes.cart, page: ()=> CartScreen()),
    GetPage(name: CustomRoutes.userProfile, page: ()=> ProfileScreen()),
    // GetPage(name: CustomRoutes.userAddress, page: ()=> UserAddressScreen()),
    GetPage(name: CustomRoutes.signup, page: ()=> SignupScreen()),
    GetPage(name: CustomRoutes.verifyEmail, page: ()=> VerifyEmailScreen()),
    GetPage(name: CustomRoutes.signIn, page: ()=> LoginScreen()),
    GetPage(name: CustomRoutes.forgetPassword, page: ()=> ForgetPassword()),
    GetPage(name: CustomRoutes.onBoarding, page: ()=> OnboardingScreen()),
  ];
}
