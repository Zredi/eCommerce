import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

import '../constants/app_colors.dart';
import '../constants/app_images.dart';
import '../controllers/user_controller.dart';
import 'circular_image.dart';


class ProfileTile extends StatelessWidget {
  const ProfileTile({
    super.key, required this.onPressed,
  });
  final VoidCallback onPressed;
  @override
  Widget build(BuildContext context) {
    final controller = UserController.instance;
    return ListTile(
      leading: CircularImage(
        image: AppImages.user,
        width: 50,
        height: 50,
        padding: 0,
      ),
      title: Text(controller.user.value.firstName +" "+ controller.user.value.lastName, style: Theme.of(context).textTheme.headlineSmall!.apply(color: AppColors.white),),
      subtitle: Text(controller.user.value.email, style: Theme.of(context).textTheme.bodyMedium!.apply(color: AppColors.white),),
      trailing: IconButton(onPressed: onPressed,icon: Icon(Iconsax.edit,color: AppColors.white,),),
    );
  }
}
