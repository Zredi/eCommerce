

import 'package:agro_ecommerce_flutter/app/constants/sizes.dart';
import 'package:flutter/cupertino.dart';

class AppSpacingStyle{
  static const EdgeInsetsGeometry paddingWithAppbarHeight = EdgeInsets.only(
    top: AppSizes.appBarHeight,
    left: AppSizes.defaultSpace,
    bottom: AppSizes.defaultSpace,
    right: AppSizes.defaultSpace,
  );
}