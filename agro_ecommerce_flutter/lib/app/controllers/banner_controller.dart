
import 'package:get/get.dart';


class BannerController extends GetxController {
  static BannerController get instance => Get.find();

  final carousalCurrentIndex = 0.obs;
  final isLoading = true.obs;
  final banners = [
    'assets/images/banners/banner1.jpg',
    'assets/images/banners/banner2.jpg',
    'assets/images/banners/banner3.jpg',

  ].obs;

  @override
  void onInit() {
    super.onInit();
    loadBanners();
  }

  void loadBanners()async{
    await Future.delayed(Duration(seconds: 2));
    isLoading.value = false;
  }

  void updatePageIndicator(index){
    carousalCurrentIndex.value = index;
  }

}