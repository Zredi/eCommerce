import 'package:flutter/material.dart';

import '../../../constants/sizes.dart';
import '../../../controllers/onboarding_controller.dart';
import '../../../utils/device_utils.dart';


class OnboardingSkip extends StatelessWidget {
  const OnboardingSkip({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
        right: AppSizes.defaultSpace,
        top: DeviceUtils.getAppBarHeight(),
        child: TextButton(
          onPressed: () => OnboardingController.instance.skipPage(),
          child: Text('Skip'),
        )
    );
  }
}
