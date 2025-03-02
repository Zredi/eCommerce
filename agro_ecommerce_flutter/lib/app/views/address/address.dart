
import 'package:agro_ecommerce_flutter/app/common_widgets/custom_shimmer_effect.dart';
import 'package:agro_ecommerce_flutter/app/common_widgets/vertical_product_shimmer.dart';
import 'package:agro_ecommerce_flutter/app/views/address/widgets/single_address.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../common_widgets/appbar.dart';
import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';
import '../../controllers/address_controller.dart';
import 'add_new_address.dart';

class UserAddressScreen extends StatelessWidget {
  const UserAddressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AddressController());
    return Scaffold(
      floatingActionButton: FloatingActionButton(
          onPressed: ()=> Get.to(()=> AddNewAddressScreen()),
          child: Icon(Iconsax.add,color: AppColors.white,),
          backgroundColor: AppColors.primary,
      ),
      appBar: CustomAppBar(
        showBackArrorw: true,
        title: Text('Addresses',style: Theme.of(context).textTheme.headlineSmall,),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Obx(
            ()=> FutureBuilder(
              key: Key(controller.refreshData.value.toString()),
              future: controller.getAllUserAddresses(),
              builder: (context, snapshot) {
              if(snapshot.connectionState == ConnectionState.waiting){
                return Center(child: CircularProgressIndicator());
              }else if (snapshot.hasError){
                return Center(child: Text("Something went wrong try again later"),);
              }else if (!snapshot.hasData || snapshot.data!.isEmpty){
                return Center(child: Text("No Addresses Available"));
              }else {
                final addresses = snapshot.data!;
                return ListView.builder(
                  shrinkWrap: true,
                  itemCount: addresses.length,
                  itemBuilder: (context, index) =>
                      SingleAddress(
                        address: addresses[index],
                        onTap: () => controller.selectAddress(addresses[index]),
                      ),
                );
               }
              }
            ),
          ),
        ),
      ),
    );
  }
}
