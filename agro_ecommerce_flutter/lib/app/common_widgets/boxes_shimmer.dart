
import 'package:flutter/material.dart';

import '../constants/sizes.dart';
import 'custom_shimmer_effect.dart';

class BoxesShimmer extends StatelessWidget {
  const BoxesShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Row(
          children: [
            Expanded(child: CustomShimmerEffetct(width: 150, height: 110)),
            SizedBox(width: AppSizes.spaceBtwItems,),
            Expanded(child: CustomShimmerEffetct(width: 150, height: 110)),
            SizedBox(width: AppSizes.spaceBtwItems,),
            Expanded(child: CustomShimmerEffetct(width: 150, height: 110)),
          ],
        )
      ],
    );
  }
}
