import 'package:flutter/material.dart';

import '../constants/app_colors.dart';
import '../constants/sizes.dart';
import '../utils/helper_functions.dart';


class CircularIcon extends StatelessWidget {
  const CircularIcon({
    super.key,
    this.width,
    this.height,
    this.size = AppSizes.lg,
    required this.icon,
    this.color,
    this.onPressed,
    this.bgColor,
  });
  final double? width,height,size;
  final IconData icon;
  final Color? color;
  final Color? bgColor;
  final VoidCallback? onPressed;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: bgColor != null ?
               bgColor! : HelperFunctions.isDarkMode(context) ?
               AppColors.black.withOpacity(0.9) : AppColors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(100)
      ),
      child: RawMaterialButton(onPressed: onPressed,child: Icon(icon,color: color,size: size,),),
    );
  }
}
