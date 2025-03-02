import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/circular_container.dart';
import '../../../common_widgets/custom_shimmer_effect.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/banner_controller.dart';

class BannerSlider extends StatelessWidget {
  const BannerSlider({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(BannerController());
    return Obx(() {
      if (controller.isLoading.value) {
        return CustomShimmerEffetct(width: double.infinity, height: 190);
      }else {
      return Column(
        children: [
          CarouselSlider(
            items: controller.banners.map((image) =>
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppSizes.cardRadiusLg),
                  child: Image.asset(
                    image,
                    fit: BoxFit.fill,

                  ),
                )
                ).toList(),
            options: CarouselOptions(
              autoPlay: true,
              viewportFraction: 1.0,
              onPageChanged: (index, reason) =>
                  controller.updatePageIndicator(index),
            ),
          ),
          const SizedBox(height: AppSizes.spaceBtwItems,),
          Obx(() =>
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  for(int i = 0; i < controller.banners.length; i++)
                    CustomCircularContainer(
                      width: 20,
                      height: 4,
                      margin: EdgeInsets.only(right: 10),
                      bgColor: controller.carousalCurrentIndex.value == i
                          ? AppColors.primary
                          : AppColors.grey,
                    ),
                ],
              ),
          )
        ],
      );
    }
    });
  }
}
