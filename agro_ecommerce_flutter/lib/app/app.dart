import 'package:agro_ecommerce_flutter/app/routes/app_routes.dart';
import 'package:agro_ecommerce_flutter/app/splash_screen.dart';
import 'package:agro_ecommerce_flutter/app/theme/app_themes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      getPages: AppRoutes.pages,
      home: SplashScreen(),
    );
  }
}
