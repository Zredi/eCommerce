import 'package:agro_ecommerce_flutter/app/views/order/widgets/orders_list.dart';
import 'package:flutter/material.dart';

import '../../constants/app_colors.dart';
import '../../constants/sizes.dart';

class OrderScreen extends StatelessWidget {
  const OrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            'Orders',
            style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                color: AppColors.white
            ),
          ),
        ),
        backgroundColor: AppColors.primary,
      ),
      body: Padding(
        padding: EdgeInsets.all(AppSizes.defaultSpace),
        child: OrderListItem(),
      ),
    );
  }
}
