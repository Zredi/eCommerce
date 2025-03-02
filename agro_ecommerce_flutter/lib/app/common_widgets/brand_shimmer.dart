import 'package:flutter/material.dart';

import 'custom_shimmer_effect.dart';
import 'grid_layout.dart';

class BrandShimmer extends StatelessWidget {
  const BrandShimmer({super.key, required this.itemCount});
  final int itemCount;
  @override
  Widget build(BuildContext context) {
    return GridLayout(
        mainAxisExtent: 85,
        itemCount: itemCount,
        itemBuilder: (p0, p1) => CustomShimmerEffetct(width: 300, height: 85),
    );
  }
}
