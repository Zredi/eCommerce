
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:iconsax/iconsax.dart';

import '../../common_widgets/appbar.dart';
import '../../constants/sizes.dart';
import '../../controllers/address_controller.dart';
import '../../utils/validators.dart';

class AddNewAddressScreen extends StatelessWidget {
  const AddNewAddressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AddressController.instance;
    return Scaffold(
      appBar: CustomAppBar(
        showBackArrorw: true,
        title: Text('Add New Address'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(AppSizes.defaultSpace),
          child: Form(
            key: controller.addressFormKey,
            child: Column(
              children: [
                TextFormField(
                  controller: controller.name,
                  validator: (value)=> Validators.validateEmptyText('Name', value),
                  decoration: InputDecoration(
                    prefixIcon: Icon(Iconsax.user),
                    labelText: 'Name'
                  ),
                ),
                SizedBox(height: AppSizes.spaceBtwInputFields,),
                TextFormField(
                  controller: controller.phoneNumber,
                  validator: Validators.validatePhoneNumber,
                  decoration: InputDecoration(
                      prefixIcon: Icon(Iconsax.mobile),
                      labelText: 'Phone Number'
                  ),
                ),
                SizedBox(height: AppSizes.spaceBtwInputFields,),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: controller.street,
                        validator: (value)=> Validators.validateEmptyText('Street', value),
                        decoration: InputDecoration(
                            prefixIcon: Icon(Iconsax.building),
                            labelText: 'Street'
                        ),
                      ),
                    ),
                    SizedBox(width: AppSizes.spaceBtwInputFields,),
                    Expanded(
                      child: TextFormField(
                        controller: controller.postalCode,
                        validator: (value)=> Validators.validateEmptyText('Postal Code', value),
                        decoration: InputDecoration(
                            prefixIcon: Icon(Iconsax.code),
                            labelText: 'Postal Code'
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: AppSizes.spaceBtwInputFields,),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: controller.city,
                        validator: (value)=> Validators.validateEmptyText('City', value),
                        decoration: InputDecoration(
                            prefixIcon: Icon(Iconsax.buildings),
                            labelText: 'City'
                        ),
                      ),
                    ),
                    SizedBox(width: AppSizes.spaceBtwInputFields,),
                    Expanded(
                      child: TextFormField(
                        controller: controller.state,
                        validator: (value)=> Validators.validateEmptyText('State', value),
                        decoration: InputDecoration(
                            prefixIcon: Icon(Iconsax.activity),
                            labelText: 'State'
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: AppSizes.spaceBtwInputFields,),
                TextFormField(
                  controller: controller.country,
                  validator: (value)=> Validators.validateEmptyText('Country', value),
                  decoration: InputDecoration(
                      prefixIcon: Icon(Iconsax.global),
                      labelText: 'Country'
                  ),
                ),
                SizedBox(height: AppSizes.defaultSpace,),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: ()=> controller.addNewAddress(context),
                    child: Text('Save'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
