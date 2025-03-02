
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';

import '../models/Stock.dart';

class StockService{

  Future<Stock> getStockByProductId(int productId) async {
    try{
      final response = await HttpHelper.get('stocks/$productId');
      return Stock.fromJson(response);
    }catch(e){
      throw Exception("Error getting stock by product: $e");
    }
  }
}