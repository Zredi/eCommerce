
import 'package:agro_ecommerce_flutter/app/views/onboarding/widgets/onboarding_dot_navigation.dart';
import 'package:agro_ecommerce_flutter/app/views/onboarding/widgets/onboarding_page.dart';
import 'package:agro_ecommerce_flutter/app/views/onboarding/widgets/onboarding_skip.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_images.dart';
import '../../constants/sizes.dart';
import '../../constants/texts.dart';
import '../../controllers/onboarding_controller.dart';
import '../../utils/device_utils.dart';
import '../../utils/helper_functions.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final controller = Get.put(OnboardingController());

    return Scaffold(
      body: Stack(
        children: [
          PageView(
            controller: controller.pageController,
            onPageChanged: controller.updatePageIndicator,
            children: const [
              OnboardingPage(image: AppImages.onBoardingImage1, title: AppTexts.onboardingTitle1,subTitle: AppTexts.onboardingSubTitle1,),
              OnboardingPage(image: AppImages.onBoardingImage2, title: AppTexts.onboardingTitle2,subTitle: AppTexts.onboardingSubTitle2,),
              OnboardingPage(image: AppImages.onBoardingImage3, title: AppTexts.onboardingTitle3,subTitle: AppTexts.onboardingSubTitle3,),
            ],
          ),
          const OnboardingSkip(),
          // const OnboardingDotNavigation(),
          const OnboardingNextButton()
        ],
      ),
    );
  }
}

class OnboardingNextButton extends StatelessWidget {
  const OnboardingNextButton({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    return Positioned(
      right: AppSizes.defaultSpace,
      bottom: DeviceUtils.getBottomNavigationBarHeight(),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
            shape: const CircleBorder(),
            backgroundColor: dark ? AppColors.primary : AppColors.primary
        ),
        onPressed: () => OnboardingController.instance.nextPage(),
        child: const Icon(Iconsax.arrow_right_3),

      ),
    );
  }
}



