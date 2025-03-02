import "package:agro_ecommerce_flutter/app/views/login/widgets/login_form.dart";
import "package:agro_ecommerce_flutter/app/views/login/widgets/login_header.dart";
import "package:flutter/material.dart";

import "../../constants/spacing_style.dart";

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SingleChildScrollView(
        child: Padding(
            padding: AppSpacingStyle.paddingWithAppbarHeight,
            child: Column(
              children: [
                LoginHeader(),
                LoginForm(),
              ],
            ),
        ),
      ),
    );
  }
}




