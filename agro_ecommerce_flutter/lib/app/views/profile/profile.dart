
import 'package:agro_ecommerce_flutter/app/views/profile/widgets/change_name.dart';
import 'package:agro_ecommerce_flutter/app/views/profile/widgets/profile_menu.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../common_widgets/appbar.dart';
import '../../common_widgets/circular_image.dart';
import '../../common_widgets/custom_shimmer_effect.dart';
import '../../common_widgets/section_heading.dart';
import '../../constants/app_images.dart';
import '../../constants/sizes.dart';
import '../../controllers/user_controller.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = UserController.instance;
    return Scaffold(
      appBar: CustomAppBar(
        showBackArrorw: true,
        title: Text('Profile'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            children: [
              const SizedBox(
                width: double.infinity,
                child: Column(
                  children: [
                    // Obx(() {
                    //   // final nwImage = controller.user.value.profilePicture;
                    //   // final image = nwImage.isNotEmpty ? nwImage : AppImages.user;
                    //
                    //   return controller.imageUploading.value
                    //     ? CustomShimmerEffetct(width: 80, height: 80,radius: 80,)
                    //     : CircularImage(
                    //     image: image,
                    //     width: 80,
                    //     height: 80,
                    //     isNetworkImage: nwImage.isNotEmpty,
                    //   );
                    // }
                    // ),
                    CircularImage(
                        image: AppImages.user,
                        width: 80,
                        height: 80,
                    ),
                    // TextButton(onPressed: ()=> controller.uploadUserProfilePicture(), child: Text('Change Profile Picture'))
                  ],
                ),
              ),
              SizedBox(height: AppSizes.spaceBtwItems/2,),
              Divider(),
              SizedBox(height: AppSizes.spaceBtwItems,),
              SectionHeading(title: 'Profile Details', showActionButton: false,),
              SizedBox(height: AppSizes.spaceBtwItems,),

              ProfileMenu(onPressed: ()=> Get.to(()=> ChangeName()), title: 'Name', value: controller.user.value.firstName +" "+ controller.user.value.lastName,),
              // ProfileMenu(onPressed: () {}, title: 'Username', value: controller.user.value.username,),


              ProfileMenu(onPressed: () {}, title: 'UserId', value: controller.user.value.id.toString(),),
              ProfileMenu(onPressed: () {}, title: 'E-Mail', value: controller.user.value.email,),
              ProfileMenu(onPressed: () {}, title: 'Phone No', value: controller.user.value.phoneNo,),
              // ProfileMenu(onPressed: () {}, title: 'Gender', value: 'Male',),
              // ProfileMenu(onPressed: () {}, title: 'D.O.B', value: '2 Mar 1998',),

              Divider(),
              SizedBox(height: AppSizes.spaceBtwItems,),
              Center(
                child: TextButton(
                  onPressed: ()=> controller.deleteAccountWarningPopup(),
                  child: Text('Delete Account',style: TextStyle(color: Colors.red),),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

