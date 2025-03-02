
import 'package:agro_ecommerce_flutter/app/services/stock_service.dart';
import 'package:get/get.dart';

import '../models/Stock.dart';

class StockController extends GetxController{
  static StockController get instance => Get.find();

  final StockService stockService = StockService();
  final RxMap<int, Stock?> stockMap = <int, Stock?>{}.obs;

  Future<void> fetchStockByProductId(int productId) async{
    try{
      Stock fetchedStock = await stockService.getStockByProductId(productId);
      stockMap[productId] = fetchedStock;
      stockMap.refresh();
    }catch(e){
      print('Error: $e');
    }
  }

  Stock? getStock(int productId) {
    return stockMap[productId];
  }
}