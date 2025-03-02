
import 'package:flutter/material.dart';

import '../../../constants/sizes.dart';
import '../../../controllers/cart_controller.dart';

class BillingAmountSection extends StatelessWidget {
  const BillingAmountSection({super.key});

  @override
  Widget build(BuildContext context) {
    final cartController = CartController.instance;
    final orderTotal = cartController.totalCartPrice.value;
    return Column(
      children: [
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Text('Subtotal',style: Theme.of(context).textTheme.bodyMedium,),
        //     Text('\$$subTotal',style: Theme.of(context).textTheme.bodyMedium,),
        //   ],
        // ),
        // SizedBox(height: AppSizes.spaceBtwItems/2,),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Text('Shipping Cost',style: Theme.of(context).textTheme.bodyMedium,),
        //     // Text('\$${MyPricingCalculator.calculateShippingCost(subTotal, 'US')}',style: Theme.of(context).textTheme.bodyMedium,),
        //     Text('₹${cartController.shippingCost}',style: Theme.of(context).textTheme.bodyMedium,),
        //   ],
        // ),
        // SizedBox(height: AppSizes.spaceBtwItems/2,),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Text('Tax',style: Theme.of(context).textTheme.bodyMedium,),
        //     // Text('\$${MyPricingCalculator.calculateTax(subTotal, 'US')}',style: Theme.of(context).textTheme.bodyMedium,),
        //     Text('500',style: Theme.of(context).textTheme.bodyMedium,),
        //   ],
        // ),
        // SizedBox(height: AppSizes.spaceBtwItems/2,),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Text('Order Total',style: Theme.of(context).textTheme.bodyMedium,),
        //     // Text('\$${MyPricingCalculator.calculateTotalPrice(subTotal, 'US')}',style: Theme.of(context).textTheme.titleMedium,),
        //     Text('₹${orderTotal}',style: Theme.of(context).textTheme.bodyMedium,),
        //   ],
        // ),
        // SizedBox(height: AppSizes.spaceBtwItems/2,),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Subtotal',style: Theme.of(context).textTheme.bodyMedium,),
            Text('₹${orderTotal}',style: Theme.of(context).textTheme.bodyMedium,),
          ],
        ),
      ],
    );
  }
}
