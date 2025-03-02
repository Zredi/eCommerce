

import 'package:agro_ecommerce_flutter/app/controllers/user_controller.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

import '../constants/app_images.dart';
import '../views/profile/profile.dart';

class UpdateNameController extends GetxController {
  static UpdateNameController get instance => Get.find();

  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final userController = UserController.instance;
  GlobalKey<FormState> updateUserNameFormKey = GlobalKey<FormState>();

  @override
  void onInit() {
    super.onInit();
    initializeName();
  }

  //fetch user record
  Future<void> initializeName() async {
    firstName.text = userController.user.value.firstName;
    lastName.text = userController.user.value.lastName;
  }

  Future<void> updateUserName() async {
    try{
      UiUtil.openLoadingDialog('We are updating your information...', AppImages.loadingAnimation);

      if(!updateUserNameFormKey.currentState!.validate()){
        UiUtil.stopLoading();
        return;
      }

      //update user's first and last name
      Map<String,dynamic> name = {
        'FirstName':firstName.text.trim(),
        'LastName':lastName.text.trim()
      };
      //update the Rx value
      userController.user.value.firstName = firstName.text.trim();
      userController.user.value.lastName = lastName.text.trim();

      UiUtil.stopLoading();

      UiUtil.successSnackBar(title: 'Congratulations',message: 'Your name has been updated.');
      Get.off(()=> ProfileScreen());
    }catch(e){
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }
}