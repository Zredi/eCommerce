
import 'package:flutter/material.dart';

import '../constants/sizes.dart';
import 'custom_shimmer_effect.dart';
import 'grid_layout.dart';

class VerticalProductShimmer extends StatelessWidget {
  const VerticalProductShimmer({super.key, this.itemCount = 4});

  final int itemCount;
  @override
  Widget build(BuildContext context) {
    return GridLayout(
        itemCount: itemCount,
        itemBuilder: (p0, p1) => SizedBox(
          width: 180,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomShimmerEffetct(width: 180, height: 180),
              SizedBox(height: AppSizes.spaceBtwItems,),
              CustomShimmerEffetct(width: 160, height: 15),
              SizedBox(height: AppSizes.spaceBtwItems/2,),
              CustomShimmerEffetct(width: 110, height: 15),
            ],
          ),
        ),
    );
  }
}
