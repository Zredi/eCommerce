import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';

import '../models/Return.dart';

class ReturnService{
  
  Future<Return> requestReturn(int orderId, int userId, String reason)async{
    try{
      final response = await HttpHelper.post('returns/request', {
        'orderId':orderId,
        'userId':userId,
        'reason':reason
      });
      return Return.fromJson(response);
    }catch(e){
      throw Exception("Error requesting return: $e");
    }
  }

  Future<Return?> getReturnByOrderId(int orderId) async {
    try {
      final response = await HttpHelper.get('returns/order/$orderId');
      if (response == null) return null;
      return Return.fromJson(response);
    } catch (e) {
      throw Exception("Error getting return by order: $e");
    }
  }
}