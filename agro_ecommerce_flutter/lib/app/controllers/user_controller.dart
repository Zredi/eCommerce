
import 'package:agro_ecommerce_flutter/app/services/user_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../constants/app_images.dart';
import '../constants/sizes.dart';
import '../models/user_model.dart';

class UserController extends GetxController {
  static UserController get instance => Get.find();

  Rx<UserModel> user = UserModel.empty().obs;
  final profileLoading = false.obs;
  final deviceStorage = GetStorage();
  final hidePassword = false.obs;
  final verifyEmail = TextEditingController();
  final verifyPassword = TextEditingController();
  GlobalKey<FormState> reAuthFormKey = GlobalKey<FormState>();
  final imageUploading = false.obs;
  final UserService userService = UserService();

  @override
  void onInit() {
    super.onInit();
    fetchUserData();
  }

  Future<void> fetchUserData() async {
    try {
      profileLoading.value = true;
      final userId = await deviceStorage.read('userId');

      final userdata = await userService.fetchUserDetails(userId);

      user(userdata);


    } catch (e) {
      print('Error in fetchUserData: $e');
      user(UserModel.empty());
    } finally {
      profileLoading.value = false;
    }
  }


  void deleteAccountWarningPopup(){
    Get.defaultDialog(
      contentPadding: EdgeInsets.all(AppSizes.md),
      title: 'Delete Account',
      middleText: 'Are you sure you want to delete your account permanently? This action is not reversible.',
      confirm: ElevatedButton(
        onPressed: ()async => deleteUserAccount(),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.red,
          side: BorderSide(color: Colors.red),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: AppSizes.lg),
          child: Text('Delete'),
        ),
      ),
      cancel: OutlinedButton(
        onPressed: ()=> Navigator.of(Get.overlayContext!).pop(),
        child: Text('Cancel'),
      ),
    );
  }

  void deleteUserAccount()async{
    try{
      UiUtil.openLoadingDialog('Processing...', AppImages.loadingAnimation);
    }catch(e){
      UiUtil.stopLoading();
      UiUtil.warningSnackBar(title: 'error!',message: e.toString());
    }
  }

  uploadUserProfilePicture()async {

  }

}