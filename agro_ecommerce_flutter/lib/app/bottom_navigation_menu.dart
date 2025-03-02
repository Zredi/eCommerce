import 'package:agro_ecommerce_flutter/app/utils/helper_functions.dart';
import 'package:agro_ecommerce_flutter/app/views/home/home_screen.dart';
import 'package:agro_ecommerce_flutter/app/views/order/order_screen.dart';
import 'package:agro_ecommerce_flutter/app/views/settings/setting_screen.dart';
import 'package:agro_ecommerce_flutter/app/views/store/store_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import 'constants/app_colors.dart';

class NavigationMenu extends StatelessWidget {
  const NavigationMenu({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(NavigationController());
    final dark = HelperFunctions.isDarkMode(context);
    return Scaffold(
      bottomNavigationBar: Obx(
            ()=> NavigationBarTheme(
              data: NavigationBarThemeData(
                labelTextStyle: MaterialStateProperty.resolveWith((states){
                  if (states.contains(MaterialState.selected)) {
                    return TextStyle(color: AppColors.white);
                  }
                  return null;
                  })
              ),
              child: NavigationBar(
                height: 70,
                selectedIndex: controller.selectedIndex.value,
                onDestinationSelected: (index) => controller.selectedIndex.value = index,
                backgroundColor: dark ? AppColors.primary : AppColors.primary,
                indicatorColor: dark ? AppColors.white.withOpacity(0.5) : AppColors.white.withOpacity(0.5),
                destinations: const [
                  NavigationDestination(icon: Icon(Iconsax.home), label: 'Home'),
                  NavigationDestination(icon: Icon(Iconsax.shop), label: 'Store'),
                  NavigationDestination(icon: Icon(Iconsax.truck), label: 'Order'),
                  NavigationDestination(icon: Icon(Iconsax.user), label: 'Profile'),
                ],
              ),
            ),
          ),
      body: Obx(()=> controller.screens[controller.selectedIndex.value]),
    );
  }
}


class NavigationController extends GetxController{
  final Rx<int> selectedIndex = 0.obs;

  final screens = [
    const HomeScreen(),
    const StoreScreen(),
    const OrderScreen(),
    const SettingsScreen(),
  ];
}