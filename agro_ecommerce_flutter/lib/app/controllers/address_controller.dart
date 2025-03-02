
import 'package:agro_ecommerce_flutter/app/controllers/user_controller.dart';
import 'package:agro_ecommerce_flutter/app/services/address_service.dart';
import 'package:agro_ecommerce_flutter/app/services/user_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

import '../common_widgets/section_heading.dart';
import '../constants/app_images.dart';
import '../constants/sizes.dart';
import '../models/address_model.dart';
import '../views/address/add_new_address.dart';
import '../views/address/widgets/single_address.dart';
import 'network_controller.dart';

class AddressController extends GetxController{
  static AddressController get instance => Get.find();

  final Rx<AddressModel> selectedAddress = AddressModel.empty().obs;
  RxBool refreshData = true.obs;
  final name = TextEditingController();
  final phoneNumber = TextEditingController();
  final street = TextEditingController();
  final postalCode = TextEditingController();
  final city = TextEditingController();
  final state = TextEditingController();
  final country = TextEditingController();
  GlobalKey<FormState> addressFormKey = GlobalKey<FormState>();
  final userController = UserController.instance;
  final userService = UserService();
  final addressService = AddressService();
  final networkManager = Get.put(NetworkManager());

  @override
  void onInit() {
    super.onInit();
    getAllUserAddresses();
  }

  Future<List<AddressModel>> getAllUserAddresses()async{
    try{
      await Future.microtask(() async {
        await userController.fetchUserData();
      });
      final addresses = userController.user.value.addresses ?? [];
      if (selectedAddress.value.id == null && addresses.isNotEmpty) {
        selectedAddress.value = addresses.first;
      }
      return addresses;
    }catch(e){
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
      return [];
    }
  }

  Future<AddressModel?> fetchAddress(int addressId) async {
    try {
      final address = await addressService.fetchAddressById(addressId);
      return address;
    } catch (e) {
      return null;
    }
  }


  Future selectAddress(AddressModel newSelectedAddress)async{
    try{
      selectedAddress.value = newSelectedAddress;
      refreshData.toggle();
      // UiUtil.successSnackBar(title: 'Success', message: 'Address selected successfully.');
      // update();
    }catch(e){
      UiUtil.errorSnackBar(title: 'Error!',message: e.toString());
    }
  }


  Future addNewAddress(BuildContext context)async{
    try{
      UiUtil.openLoadingDialog('Storing Address...', AppImages.loadingAnimation);
      final isConnected = await networkManager.isConnected();
      if(!isConnected){
        UiUtil.stopLoading();
        return;
      }
      if(!addressFormKey.currentState!.validate()){
        UiUtil.stopLoading();
        return;
      }
      final address = AddressModel(
          name: name.text.trim(),
          phoneNo: phoneNumber.text.trim(),
          street: street.text.trim(),
          city: city.text.trim(),
          state: state.text.trim(),
          zipCode: postalCode.text.trim(),
          country: country.text.trim(),
      );
      final newAddress = await userService.addAddress(userController.user.value.id!, address);
      await getAllUserAddresses();
      selectedAddress(newAddress);
      refreshData.toggle();
      UiUtil.stopLoading();
      UiUtil.successSnackBar(title: 'Congratulations',message: 'Your address has been successfully saved.');
      resetFormFields();
      Navigator.of(context).pop();
    }catch(e){
      UiUtil.stopLoading();
      UiUtil.errorSnackBar(title: 'error!',message: e.toString());
    }
  }

  Future<dynamic> selectNewAddressPopup(BuildContext context){
    return showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(AppSizes.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SectionHeading(title: 'Select Address',showActionButton: false,),
            SizedBox(height: AppSizes.spaceBtwItems,),
            Expanded(
              child: FutureBuilder(
                      future: getAllUserAddresses(),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Center(child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Center(child: Text('Error loading addresses'));
                        } else
                        if (!snapshot.hasData || snapshot.data!.isEmpty) {
                          return Center(child: Text('No addresses found'));
                        } else {
                          return ListView.builder(
                            shrinkWrap: true,
                            itemCount: snapshot.data!.length,
                            itemBuilder: (context, index) =>
                                SingleAddress(
                                  address: snapshot.data![index],
                                  onTap: () async {
                                    await selectAddress(snapshot.data![index]);
                                    Navigator.of(context).pop();
                                  },
                                ),
                          );
                        }
                      },
                    )
            ),
            SizedBox(height: AppSizes.spaceBtwItems,),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: (){
                  Navigator.of(context).pop();
                  Get.to(()=> AddNewAddressScreen());
                },
                child: Text('Add new address'),
              ),
            )
          ],
        ),
      ),
    );
  }

  void resetFormFields(){
    name.clear();
    phoneNumber.clear();
    street.clear();
    postalCode.clear();
    city.clear();
    state.clear();
    country.clear();
    addressFormKey.currentState!.reset();
  }
}