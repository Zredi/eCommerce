// import 'package:flu_fire/common/widgets/custom_shapes/containers/rounded_container.dart';
// import 'package:flu_fire/common/widgets/images/rounded_image.dart';
// import 'package:flu_fire/common/widgets/products/favorite_icon/favorite_icon.dart';
// import 'package:flu_fire/common/widgets/texts/brand_title_text_with_icon.dart';
// import 'package:flu_fire/common/widgets/texts/product_price_text.dart';
// import 'package:flu_fire/common/widgets/texts/product_title_text.dart';
// import 'package:flu_fire/features/shop/models/product_model.dart';
// import 'package:flu_fire/utils/constants/image_strings.dart';
// import 'package:flu_fire/utils/helpers/helper_functions.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:iconsax/iconsax.dart';
//
// import '../../../../features/shop/controllers/product_controller.dart';
// import '../../../../utils/constants/colors.dart';
// import '../../../../utils/constants/enums.dart';
// import '../../../../utils/constants/sizes.dart';
// import '../../../styles/shadows.dart';
// import '../../icons/circular_icon.dart';
//
// class ProductCardHorizontal extends StatelessWidget {
//   const ProductCardHorizontal({super.key, required this.product});
//
//   final ProductModel product;
//
//   @override
//   Widget build(BuildContext context) {
//     final controller = ProductController.instance;
//     final salePercentage = controller.calculateSalePercentage(product.price, product.salePrice);
//     final dark = MyHelperFunctions.isDarkMode(context);
//     return Container(
//         width: 310,
//         padding: EdgeInsets.all(1),
//         decoration: BoxDecoration(
//         borderRadius: BorderRadius.circular(MySizes.productImageRadius),
//         color: dark ? MyColors.darkerGrey : MyColors.lightContainer,
//         ),
//       child: Row(
//         children: [
//           RoundedContainer(
//             height: 120,
//             padding: EdgeInsets.all(MySizes.sm),
//             bgColor: dark ? MyColors.dark : MyColors.light,
//             child: Stack(
//               children: [
//                 SizedBox(width: 120,height:120,child: RoundedImage(imageUrl: product.thumbnail,isNetworkImage: true,applyImageRadius: true,)),
//                 if(salePercentage != null)
//                 Positioned(
//                   top: 7,
//                   child: RoundedContainer(
//                     radius: MySizes.sm,
//                     bgColor: MyColors.secondary.withOpacity(0.8),
//                     padding: EdgeInsets.symmetric(horizontal: MySizes.sm,vertical: MySizes.xs),
//                     child: Text('$salePercentage%', style: Theme.of(context).textTheme.labelLarge!.apply(color: MyColors.black),),
//                   ),
//                 ),
//                 Positioned(
//                     top: 0,
//                     right: 0,
//                     child: FavoriteIcon(productId: product.id,)
//                 ),
//               ],
//             ),
//           ),
//           SizedBox(
//             width: 172,
//             child: Padding(
//               padding: const EdgeInsets.only(top: MySizes.sm,left: MySizes.sm),
//               child: Column(
//                 children: [
//                   Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       ProductTitleText(title: product.title,smallSize: true,),
//                       SizedBox(height: MySizes.spaceBtwItems/2,),
//                       BrandTitleTextWithIcon(title: product.brand!.name)
//                     ],
//                   ),
//                   Spacer(),
//                   Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     children: [
//                       Flexible(
//                         child: Column(
//                           children: [
//                             if(product.productType == ProductType.single.toString() && product.salePrice > 0)
//                               Padding(
//                                 padding: const EdgeInsets.only(left: MySizes.sm),
//                                 child: Text(product.price.toString(),style: Theme.of(context).textTheme.labelMedium!.apply(decoration: TextDecoration.lineThrough),),
//                               ),
//                             Padding(
//                               padding: const EdgeInsets.only(left: MySizes.sm),
//                               child: ProductPriceText(price: controller.getProductPrice(product),),
//                             ),
//                           ],
//                         ),
//                       ),
//                       Container(
//                         decoration: BoxDecoration(
//                             color: MyColors.dark,
//                             borderRadius: BorderRadius.only(
//                                 topLeft: Radius.circular(MySizes.cardRadiusMd),
//                                 bottomRight: Radius.circular(MySizes.productImageRadius)
//                             )
//                         ),
//                         child: SizedBox(
//                             width: MySizes.iconLg*1.2,
//                             height: MySizes.iconLg*1.2,
//                             child: Center(child: Icon(Iconsax.add,color: MyColors.white,))
//                         ),
//                       ),
//                     ],
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
