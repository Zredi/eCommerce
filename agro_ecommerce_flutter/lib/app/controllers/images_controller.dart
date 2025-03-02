

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../constants/sizes.dart';
import '../models/Product.dart';
import '../utils/http_util.dart';

class ImagesController extends GetxController{
  static ImagesController get instance => Get.find();

  RxString selectedProductImage = ''.obs;
  final baseUrl = HttpHelper.baseUrl.replaceAll('/api/v1', '');

  List<String> getAllProductImages(Product product){
    if(product.images.isEmpty){
      return [];
    }
    selectedProductImage.value = "$baseUrl${product.images[0].downloadUrl}";
    return product.images.map((image) => "$baseUrl${image.downloadUrl}").toList();
  }

  void showEnlargedImage(String image){
    Get.to(
      fullscreenDialog: true,
        ()=> Dialog.fullscreen(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: EdgeInsets.symmetric(vertical: AppSizes.defaultSpace*2, horizontal: AppSizes.defaultSpace),
                child: CachedNetworkImage(imageUrl: image,),
              ),
              SizedBox(height: AppSizes.spaceBtwSections,),
              Align(
                alignment: Alignment.bottomCenter,
                child: SizedBox(
                  width: 150,
                  child: OutlinedButton(
                    onPressed: ()=> Get.back(),
                    child: Text('Close'),
                  ),
                ),
              )
            ],
          ),
        )
    );
  }
}