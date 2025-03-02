
import 'package:agro_ecommerce_flutter/app/controllers/auth_controller.dart';
import 'package:agro_ecommerce_flutter/app/controllers/login_controller.dart';
import 'package:agro_ecommerce_flutter/app/views/cart/cart_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/header_container.dart';
import '../../common_widgets/section_heading.dart';
import '../../common_widgets/settings_menu_tiles.dart';
import '../../common_widgets/user_profile.dart';
import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';
import '../address/address.dart';
import '../order/order_screen.dart';
import '../profile/profile.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            PrimaryHeaderContainer(
              child: Column(
                children: [
                  CustomAppBar(title: Text('Account',style: Theme.of(context).textTheme.headlineMedium!.apply(color: AppColors.white),),),
                  ProfileTile(onPressed: ()=> Get.to(()=> ProfileScreen()),),
                  const SizedBox(height: AppSizes.spaceBtwSections,),
                ],
              ),
            ),

            Padding(
              padding: EdgeInsets.all(AppSizes.defaultSpace),
              child: Column(
                children: [
                  SectionHeading(title: 'Account Settings',showActionButton: false,),
                  SizedBox(height: AppSizes.spaceBtwItems,),
                  SettingsMenuTile(icon: Iconsax.safe_home, title: 'My Address', subTitle: 'Set delivery address', onTap: ()=> Get.to(()=> UserAddressScreen())),
                  SettingsMenuTile(icon: Iconsax.shopping_cart, title: 'My Cart', subTitle: 'Add, remove products', onTap: ()=> Get.to(()=> CartScreen())),
                  SettingsMenuTile(icon: Iconsax.bag_tick, title: 'My Orders', subTitle: 'In-progress and Completed orders', onTap: ()=> Get.to(()=> OrderScreen())),
                  // SettingsMenuTile(icon: Iconsax.bank, title: 'Bank Details', subTitle: 'withdraw balance to registered bank account', onTap: (){}),
                  // SettingsMenuTile(icon: Iconsax.discount_shape, title: 'My Coupons', subTitle: 'List of all the discounted coupons', onTap: (){}),
                  // SettingsMenuTile(icon: Iconsax.notification, title: 'Notifications', subTitle: 'set any kind of notification message', onTap: (){}),
                  SettingsMenuTile(icon: Iconsax.security_card, title: 'Account Privacy', subTitle: 'Manage data usage and connected accounts', onTap: (){}),
                  SizedBox(height: AppSizes.spaceBtwSections,),

                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.red)
                      ),
                      onPressed: ()=> controller.logoutUser(),
                      child: Text('Logout',style: TextStyle(color: Colors.red),),),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

