
import 'package:get_storage/get_storage.dart';

import '../models/user_model.dart';
import '../utils/http_util.dart';

class AuthService {

  final deviceStorage = GetStorage();

  Future<Map<String, dynamic>> signupUser(UserModel user) async {
    try {
      final response = await HttpHelper.post('auth/create', user.toJson());

      if (response.containsKey('data')) {
        return {'success': true, 'message': 'Signup Successful'};
      } else {
        return {'success': false, 'message': response['message']};
      }
    } catch (error) {
      return {'success': false, 'message': 'Failed to sign up'};
    }
  }


  Future<Map<String, dynamic>> login(String email, String password) async {
    final data = {
      'email': email.trim(),
      'password': password.trim(),
    };

    try {
      final response = await HttpHelper.post('auth/login', data);
      print("response: $response");
      if (response.containsKey('data')) {
        final jwtResponse = response['data'];
        await saveToken(jwtResponse['token'], jwtResponse['refreshToken'],jwtResponse['id']);
        return {'success': true, 'message': 'Login Successful'};
      } else {
        return {'success': false, 'message': response['message']};
      }
    } catch (error) {
      print("Error:$error");
      return {'success': false, 'message': 'Failed to login'};
    }
  }


  Future<void> saveToken(String token, String refreshToken, int id) async {
    await deviceStorage.write('userId',id);
    await deviceStorage.write('token', token);
    await deviceStorage.write('refreshToken', refreshToken);
  }

  Future<bool> refreshToken(String refreshToken) async {
    try {
      Map<String, dynamic> response = await HttpHelper.post('auth/refresh-token', {
        'refreshToken': refreshToken
      });

      if (response['message'] == 'Token refreshed successfully') {
        String newToken = response['data']['token'];
        String newRefreshToken = response['data']['refreshToken'];

        await deviceStorage.write('token', newToken);
        await deviceStorage.write('refreshToken', newRefreshToken);
        return true;
      }
      return false;
    } catch (e) {
      print("Error in refreshing token: $e");
      return false;
    }
  }

  Future<bool> isAuthenticated() async {
    String? authToken = await deviceStorage.read('authToken');
    String? refreshToken = await deviceStorage.read('refreshToken');

    if (authToken != null) {
      return await this.refreshToken(refreshToken!);
    }

    if (refreshToken != null) {
      return await this.refreshToken(refreshToken);
    }
    return false;
  }

  Future<void> logout() async {
    await deviceStorage.remove('token');
    await deviceStorage.remove('refreshToken');
    await deviceStorage.remove('userId');
  }
}