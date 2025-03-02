import 'package:agro_ecommerce_flutter/app/constants/app_colors.dart';
import 'package:agro_ecommerce_flutter/app/controllers/auth_controller.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    AuthController.instance.screenRedirect();
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            Text("welcome to Ecom")
          ],
        ),
      ),
    );
  }
}
