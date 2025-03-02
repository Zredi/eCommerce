
import 'package:agro_ecommerce_flutter/app/controllers/user_controller.dart';
import 'package:agro_ecommerce_flutter/app/services/cart_service.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../models/Product.dart';
import '../models/cart.dart';
import '../utils/ui_util.dart';

class CartController extends GetxController{
  static CartController get instance => Get.find();

  final CartService cartService = CartService();
  final UserController userController = UserController.instance;
  final deviceStorage = GetStorage();

  RxInt noOfCartItems = 0.obs;
  RxDouble totalCartPrice = 0.0.obs;
  RxInt productQuantityInCart = 0.obs;
  RxList<CartItemModel> cartItems = <CartItemModel>[].obs;

  @override
  void onInit() {
    super.onInit();
    ever(userController.user, (_) {
      fetchCart();
    });
  }

  Future<void> addItemToCart(int productId, int quantity) async {
    try {
      final token = await deviceStorage.read('token');

      await cartService.addItemToCart(productId, quantity, token);
      fetchCart();
    }catch(e){
      UiUtil.errorSnackBar(title: 'Failed to add product to cart');
    }
  }

  Future<void> fetchCart() async {
    try {
      final token = await deviceStorage.read('token');
      print(token);
      final userId = userController.user.value.id;
      Cart cart = await cartService.getCart(userId!, token);

      cartItems.assignAll(cart.items!);
      noOfCartItems.value = cart.items!.length;

      totalCartPrice.value = cart.totalAmount!;
    } catch (e) {
      print(e);
      UiUtil.errorSnackBar(title: 'Failed to fetch cart: $e');
    }
  }

  Future<void> addOneToCart(CartItemModel item) async {
    try {
      final cartId = userController.user.value.cart?.cartId;
      final token = await deviceStorage.read('token');
      print(token);
      await cartService.updateItemQuantity(cartId!, item.product!.id, item.quantity! + 1, token);
      item.quantity = item.quantity! + 1;
      double totalPrice = await cartService.getTotalCartPrice(cartId,token);
      totalCartPrice.value = totalPrice;
      cartItems.refresh();
    } catch (e) {
      UiUtil.errorSnackBar(title: 'Failed to update quantity: $e');
    }
  }

  Future<void> removeOneFromCart(CartItemModel item) async {
    try {
      final cartId = userController.user.value.cart?.cartId;
      final token = await deviceStorage.read('token');
      if (item.quantity! > 1) {
        await cartService.updateItemQuantity(cartId!, item.product!.id, item.quantity! - 1, token);
        item.quantity = item.quantity! - 1;
      } else {
        await cartService.removeItemFromCart(cartId!, item.product!.id, token);
        cartItems.remove(item);
        noOfCartItems -= 1;
        UiUtil.customToast(message: "Item removed from cart");
      }
      double totalPrice = await cartService.getTotalCartPrice(cartId,token);
      totalCartPrice.value = totalPrice;
      cartItems.refresh();
    } catch (e) {
      UiUtil.errorSnackBar(title: 'Failed to update quantity: $e');
    }
  }

  Future<void> updateItemQuantityInCart(CartItemModel item, int newQuantity) async {
    try {
      final cartId = userController.user.value.cart?.cartId;
      final token = await deviceStorage.read('token');
      if (cartId != null && token != null) {
        await cartService.updateItemQuantity(cartId, item.product!.id, newQuantity, token);
        item.quantity = newQuantity;
        double totalPrice = await cartService.getTotalCartPrice(cartId, token);
        totalCartPrice.value = totalPrice;
        cartItems.refresh();
      }
    } catch (e) {
      UiUtil.errorSnackBar(title: 'Failed to update quantity', message: e.toString());
    }
  }

  void updateAlreadyAddedProductCount(Product product) {
    final existingItem = cartItems.firstWhereOrNull((item) => item.product?.id == product.id);
    productQuantityInCart.value = existingItem?.quantity ?? 0;
  }

  Future<void> clearCart(int cartId)async{
    try{
      final token = await deviceStorage.read('token');
      await cartService.clearCart(cartId, token);
      cartItems.clear();
    }catch(e){
      print("Failed to clear");
    }
  }

}