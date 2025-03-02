import 'package:flutter/material.dart';

import '../../../constants/app_images.dart';
import '../../../constants/sizes.dart';
import '../../../constants/texts.dart';
import '../../../utils/helper_functions.dart';

class LoginHeader extends StatelessWidget {
  const LoginHeader({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Image(
          height: 50,
          image: AssetImage(dark ? AppImages.darkAppLogo : AppImages.lightAppLogo),
        ),
        const SizedBox(height: AppSizes.md,),
        Text(AppTexts.loginTitle,style: Theme.of(context).textTheme.headlineMedium,),
        const SizedBox(height: AppSizes.sm,),
        Text(AppTexts.loginSubTitle, style: Theme.of(context).textTheme.bodyMedium,),
      ],
    );
  }
}
