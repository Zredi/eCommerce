import 'package:cached_network_image/cached_network_image.dart';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../common_widgets/appbar.dart';
import '../../../common_widgets/curved_edges_widget.dart';
import '../../../common_widgets/rounded_image.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../controllers/images_controller.dart';
import '../../../models/Product.dart';
import '../../../utils/helper_functions.dart';


class ProductImageSlider extends StatelessWidget {
  const ProductImageSlider({
    super.key, required this.product,
  });

  final Product product;
  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    final controller = Get.put(ImagesController());
    final images = controller.getAllProductImages(product);
    return CurvedEdgeWidget(
      child: Container(
        color: dark ? AppColors.darkerGrey : AppColors.light,
        child: Stack(
          children: [
            SizedBox(
                height: 300,
                child: PageView.builder(
                  itemCount: images.length,
                  onPageChanged: (index){
                    controller.selectedProductImage.value = images[index];
                  },
                  itemBuilder: (_, index)=> GestureDetector(
                    onTap: ()=> controller.showEnlargedImage(images[index]),
                    child: Padding(
                      padding: EdgeInsets.all(AppSizes.productImageRadius * 2),
                      child: CachedNetworkImage(
                        imageUrl: images[index],
                        progressIndicatorBuilder: (context, url, progress)=>
                        Center(
                          child: CircularProgressIndicator(
                            value: progress.progress,
                            color: AppColors.primary,
                          ),
                        )
                      ),
                    ),
                  ),
                )

                // Padding(
                //   padding:
                //   const EdgeInsets.all(AppSizes.productImageRadius*2),
                //   child: Center(
                //       child:
                //       Obx((){
                //         final image = controller.selectedProductImage.value;
                //         return GestureDetector(
                //           onTap: ()=> controller.showEnlargedImage(image),
                //           child: CachedNetworkImage(
                //             imageUrl: image,
                //             progressIndicatorBuilder: (context, url, progress) =>
                //                 CircularProgressIndicator(value: progress.progress,color: AppColors.primary,),
                //           ),
                //         );
                //       })
                //   ),
                // )

            ),

            // Positioned(
            //   right: 0,
            //   bottom: 30,
            //   left: AppSizes.defaultSpace,
            //   child: SizedBox(
            //     height: 80,
            //     child: ListView.separated(
            //       shrinkWrap: true,
            //       scrollDirection: Axis.horizontal,
            //       physics: AlwaysScrollableScrollPhysics(),
            //       itemCount: images.length,
            //       separatorBuilder: (_, __) => SizedBox(
            //         width: AppSizes.spaceBtwItems,
            //       ),
            //       itemBuilder: (_, index) => Obx((){
            //         final imageSelected = controller.selectedProductImage.value == images[index];
            //         return RoundedImage(
            //             width: 80,
            //             bgColor: dark ? AppColors.dark : AppColors.white,
            //             border: Border.all(color: imageSelected ? AppColors.primary : Colors.transparent),
            //             padding: EdgeInsets.all(AppSizes.sm),
            //             imageUrl: images[index],
            //             isNetworkImage: true,
            //             onPressed: ()=> controller.selectedProductImage.value = images[index],
            //         );
            //       })
            //     ),
            //   ),
            // ),

            CustomAppBar(
              showBackArrorw: true,
              actions: [
                // FavoriteIcon(productId: product.id,),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
