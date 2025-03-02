
import 'package:agro_ecommerce_flutter/app/controllers/address_controller.dart';
import 'package:agro_ecommerce_flutter/app/controllers/user_controller.dart';
import 'package:agro_ecommerce_flutter/app/models/Invoice.dart';
import 'package:agro_ecommerce_flutter/app/services/order_service.dart';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../bottom_navigation_menu.dart';
import '../common_widgets/success_screen.dart';
import '../constants/app_images.dart';
import '../models/order_model.dart';
import 'cart_controller.dart';


class OrderController extends GetxController {
  static OrderController get instance => Get.find();

  final deviceStorage = GetStorage();
  final cartController = CartController.instance;
  final userController = UserController.instance;
  final addressController = Get.put(AddressController());
  final orderService = OrderService();
  // final addressController = AddressController.instance;
  // final checkoutController = CheckoutController.instance;
  // final orderRepository = Get.put(OrderRepository());

  Future<List<OrderModel>> fetchUserOrders() async {
    try{
      final userId = userController.user.value.id;
      final token = deviceStorage.read('token');
      return await orderService.fetchUserOrders(userId!, token);
    }catch(e){
      UiUtil.errorSnackBar(title: 'error!', message: e.toString());
      return [];
    }
  }

  void processOrder() async {
    try{
      UiUtil.openLoadingDialog('Processing your order...', AppImages.loadingAnimation);

      final userId = userController.user.value.id;
      final addressId = addressController.selectedAddress.value.id;
      final token = deviceStorage.read('token');
      await orderService.createOrder(userId!, addressId!, token);
      cartController.clearCart(userController.user.value.cart!.cartId);
      Get.offAll(()=> SuccessScreen(
        image: AppImages.loadingAnimation,
        title: 'Order Places Successfully',
        subTitle: 'Your item will be shipped soon',
        onPressed: ()=> Get.offAll(()=> NavigationMenu()),
        )
      );
    }catch(e){
      UiUtil.errorSnackBar(title: 'Error!',message: e.toString());
    }
  }

  Future<Invoice?> fetchInvoice(int orderId) async {
    try {
      final invoice = await orderService.getInvoiceByOrderId(orderId);
      print("Invoice fetched successfully: ${invoice.toJson()}");
      return invoice;
    } catch (e) {
      return null;
    }
  }

}