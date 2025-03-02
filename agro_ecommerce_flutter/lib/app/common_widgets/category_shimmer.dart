import 'package:flutter/material.dart';

import '../constants/sizes.dart';
import 'custom_shimmer_effect.dart';

class CategoryShimmer extends StatelessWidget {
  const CategoryShimmer({super.key, this.itemCount = 6});

  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 80,
      child: ListView.separated(
          itemCount: itemCount,
          shrinkWrap: true,
          scrollDirection: Axis.horizontal,
          separatorBuilder: (context, index) => SizedBox(width: AppSizes.spaceBtwItems,),
          itemBuilder: (context, index) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomShimmerEffetct(width: 50, height: 50,radius: 8,),
                SizedBox(height: AppSizes.spaceBtwItems/2,),
                CustomShimmerEffetct(width: 40, height: 8)
              ],
            );
          },
      ),
    );
  }
}
