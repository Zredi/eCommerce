import 'dart:async';
import 'package:agro_ecommerce_flutter/app/utils/ui_util.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:get/get.dart';

class NetworkManager extends GetxController {
  static NetworkManager get instance => Get.find();
  final Connectivity connectivity = Connectivity();
  late StreamSubscription<List<ConnectivityResult>> connectivitySubscription;
  final Rx<ConnectivityResult> connectionStatus = ConnectivityResult.none.obs;

  @override
  void onInit() {
    super.onInit();
    connectivitySubscription = connectivity.onConnectivityChanged.listen((List<ConnectivityResult> results) {
      updateConnectionStatus(results);
    });
  }

  Future<void> updateConnectionStatus(List<ConnectivityResult> results) async {
    if (results.contains(ConnectivityResult.none)) {
      connectionStatus.value = ConnectivityResult.none;
      UiUtil.customToast(message: 'No Internet Connection');
    } else {
      connectionStatus.value = results.first;
    }
  }

  Future<bool> isConnected() async {
    try {
      final results = await connectivity.checkConnectivity();
      return results.contains(ConnectivityResult.none) == false;
    } catch (e) {
      return false;
    }
  }

  @override
  void onClose() {
    super.onClose();
    connectivitySubscription.cancel();
  }
}
