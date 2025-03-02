
import 'package:agro_ecommerce_flutter/app/views/order/widgets/order_details.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:intl/intl.dart';

import '../../../bottom_navigation_menu.dart';
import '../../../common_widgets/animation_loader.dart';
import '../../../common_widgets/rounded_container.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/app_images.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/order_controller.dart';
import '../../../utils/helper_functions.dart';

class OrderListItem extends StatelessWidget {
  const OrderListItem({super.key});

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final controller = Get.put(OrderController());
    return FutureBuilder(
        future: controller.fetchUserOrders(),
        builder: (context, snapshot) {
          final emptyWidget = AnimationLoaderWidget(
            text: 'Sorry No Orders yet!',
            animation: AppImages.loadingAnimation,
            // showAction: true,
            // actionText: 'Let\'s order',
            // onActionPressed: () => Get.off(() => NavigationMenu()),
          );
          if(snapshot.connectionState == ConnectionState.waiting){
            return Center(child: CircularProgressIndicator());
          }else if (snapshot.hasError){
            return Center(child: Text("Something went wrong try again later"),);
          }else if (!snapshot.hasData || snapshot.data!.isEmpty){
            return emptyWidget;
          }else {
            final orders = snapshot.data!;
            return ListView.separated(
                shrinkWrap: true,
                itemCount: orders.length,
                separatorBuilder: (context, index) =>
                    SizedBox(
                      height: AppSizes.spaceBtwItems,
                    ),
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return RoundedContainer(
                    padding: EdgeInsets.all(AppSizes.md),
                    showBorder: true,
                    bgColor: dark ? AppColors.dark : AppColors.light,
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(Iconsax.ship),
                            SizedBox(
                              width: AppSizes.spaceBtwItems / 2,
                            ),
                            Expanded(
                              child: Text(
                                order.status,
                                style: Theme
                                    .of(context)
                                    .textTheme
                                    .bodyLarge!
                                    .apply(
                                    color: AppColors.primary,
                                    fontWeightDelta: 1),
                              ),
                            ),
                            IconButton(
                                onPressed: ()=> Get.to(()=> OrderDetails(order: order)),
                                icon: Icon(
                                  Iconsax.arrow_right_34,
                                  size: AppSizes.iconSm,
                                ))
                          ],
                        ),
                        SizedBox(
                          height: AppSizes.spaceBtwItems,
                        ),
                        Row(
                          children: [
                            Expanded(
                                child: Row(
                                  children: [
                                    Icon(Iconsax.tag),
                                    SizedBox(
                                      width: AppSizes.spaceBtwItems / 2,
                                    ),
                                    Expanded(
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment: CrossAxisAlignment
                                            .start,
                                        children: [
                                          Text(
                                            'Order Id',
                                            style: Theme
                                                .of(context)
                                                .textTheme
                                                .labelMedium,
                                          ),
                                          Text(
                                            order.id.toString(),
                                            style: Theme
                                                .of(context)
                                                .textTheme
                                                .titleMedium,
                                          )
                                        ],
                                      ),
                                    )
                                  ],
                                )),
                            Expanded(
                                child: Row(
                                  children: [
                                    Icon(Iconsax.calendar),
                                    SizedBox(
                                      width: AppSizes.spaceBtwItems / 2,
                                    ),
                                    Expanded(
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment: CrossAxisAlignment
                                            .start,
                                        children: [
                                          Text(
                                            'Order Date',
                                            style: Theme
                                                .of(context)
                                                .textTheme
                                                .labelMedium,
                                          ),
                                          Text(
                                            DateFormat('dd/MM/yyyy').format(
                                                order.orderDate),
                                            style: Theme
                                                .of(context)
                                                .textTheme
                                                .titleMedium,
                                          )
                                        ],
                                      ),
                                    )
                                  ],
                                )),
                          ],
                        ),
                      ],
                    ),
                  );
                });
          }
        });
  }
}
