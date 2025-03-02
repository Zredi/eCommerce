
import 'package:agro_ecommerce_flutter/app/services/return_service.dart';
import 'package:get/get.dart';

import '../models/Return.dart';

class ReturnController extends GetxController {
  static ReturnController get instance => Get.find();

  final ReturnService returnService = ReturnService();
  final Rx<Return?> currentReturn = Rx<Return?>(null);

  Future<void> getReturnByOrderId(int orderId) async{
    try{
      final fetchedReturn = await returnService.getReturnByOrderId(orderId);
      currentReturn.value = fetchedReturn;
    }catch(e){
      print("Error: $e");
      currentReturn.value = null;
    }
  }

  Future<void> requestReturn(int orderId, int userId, String reason) async {
    try {
      await returnService.requestReturn(orderId, userId, reason);
      await getReturnByOrderId(orderId);
      Get.snackbar(
        'Success',
        'Return request submitted successfully',
        snackPosition: SnackPosition.TOP,
      );
    } catch (e) {
      print('Error: $e');
      Get.snackbar(
        'Error',
        'Failed to submit return request',
        snackPosition: SnackPosition.TOP,
      );
    }
  }
}