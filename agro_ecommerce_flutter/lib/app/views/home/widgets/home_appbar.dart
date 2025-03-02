
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_state_manager/get_state_manager.dart';

import '../../../common_widgets/appbar.dart';
import '../../../common_widgets/cart_menu_icon.dart';
import '../../../common_widgets/custom_shimmer_effect.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/texts.dart';
import '../../../controllers/user_controller.dart';



class CustomHomeAppbar extends StatelessWidget {
  const CustomHomeAppbar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(UserController());
    return CustomAppBar(
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(AppTexts.homeAppbarTitle, style: Theme.of(context).textTheme.labelLarge!.apply(color: AppColors.grey)),
          Obx(() {
            if(controller.profileLoading.value){
              return CustomShimmerEffetct(width:100,height:15);
            }else{
              return Text(controller.user.value.firstName +" "+ controller.user.value.lastName, style: Theme
                  .of(context)
                  .textTheme
                  .headlineSmall!
                  .apply(color: AppColors.white));
            }
          }
          ),
        ],
      ),
      actions: [
        CartCounterIcon(iconColor: AppColors.white,counterBgColor: AppColors.secondary,counterTextColor: AppColors.white,),
      ],
    );
  }
}
