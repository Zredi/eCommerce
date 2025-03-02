import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/section_heading.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/address_controller.dart';


class BillingAddressSection extends StatelessWidget {
  const BillingAddressSection({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AddressController.instance;
    return Obx(
      ()=> Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHeading(
            title: 'Shipping Address',
            buttonTitle: 'Change',
            onPressed: ()=> controller.selectNewAddressPopup(context),
          ),
          controller.selectedAddress.value.id != null ?
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(controller.selectedAddress.value.name,style: Theme.of(context).textTheme.bodyLarge,),
              SizedBox(height: AppSizes.spaceBtwItems/2,),
              Row(
                children: [
                  Icon(Icons.phone,color: Colors.grey,size: 16,),
                  SizedBox(width: AppSizes.spaceBtwItems,),
                  Text(controller.selectedAddress.value.phoneNo,style: Theme.of(context).textTheme.bodyMedium,),
                ],
              ),
              SizedBox(height: AppSizes.spaceBtwItems/2,),
              Row(
                children: [
                  Icon(Icons.location_history,color: Colors.grey,size: 16,),
                  SizedBox(width: AppSizes.spaceBtwItems,),
                  Expanded(child: Text(controller.selectedAddress.value.toString(),style: Theme.of(context).textTheme.bodyMedium,softWrap: true,)),
                ],
              ),
            ],
          ) : Text('Select Address', style: Theme.of(context).textTheme.bodyMedium,),
        ],
      ),
    );
  }
}
