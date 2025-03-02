
import 'package:flutter/material.dart';

import '../constants/sizes.dart';
import 'custom_shimmer_effect.dart';

class ListTileShimmer extends StatelessWidget {
  const ListTileShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Row(
          children: [
            CustomShimmerEffetct(width: 50, height: 50,radius: 50,),
            SizedBox(width: AppSizes.spaceBtwItems,),
            Column(
              children: [
                CustomShimmerEffetct(width: 100, height: 15),
                SizedBox(height: AppSizes.spaceBtwItems / 2),
                CustomShimmerEffetct(width: 80, height: 12),
              ],
            )
          ],
        )
      ],
    );
  }
}
