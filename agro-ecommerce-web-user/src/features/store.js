import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import signupReducer from "./signupReducer";
import profileReducer from "./profileReducer";
import StoreReducer from "./StoreReducer";
import ProductReducer from "./ProductReducer";
import imageReducer from "./imageReducer";
import cartReducer from "./cartReducer";
import checkoutReducer from "./checkoutReducer";
import StockReducer from "./StockReducer";
import ManufactureReducers from "./ManufactureReducers";
import UnitReducer from "./UnitReducer";
import SubUnitReducer from "./SubUnitReducer";
import InventoryReducer from "./InventoryReducer";
import CategoryReducer from "./CategoryReducer";
import SubCategoryReducer from "./SubCategoryReducer";
import OrderReducer from "./OrderReducer";
import ShoppingBagReducer from "./ShoppingBagReducer";
import UserShoppingReducer from "./UserShoppingReducer";
import addressReducer from "./addressReducer";
import userAddressReducer from "./userAddressReducer";
import UserShoppingHistoryReducer from "./UserShoppingHistoryReducer";
import MessageReducer from "./MessageReducer";
import dashboardReducer from "./dashboardReducer";
import bucketReducer from "./bucketReducer";
import InvoiceReducer from "./InvoiceReducer";
import NotificationReducer from "./NotificationReducer";
import ReturnReducer from "./ReturnReducer";
import SnackbarReducer from "./snackbarReducer";
import WishlistReducer from "./WishlistReducer";

export const store= configureStore({
    reducer :{
        auth : authReducer,
        user : userReducer,
        signup: signupReducer,
        profile: profileReducer,
        store: StoreReducer,
        product: ProductReducer,
        image: imageReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        stock: StockReducer,
        manufacturer: ManufactureReducers,
        unit: UnitReducer,
        subUnit: SubUnitReducer,
        inventory: InventoryReducer,
        category: CategoryReducer,
        subCategory: SubCategoryReducer,
        order: OrderReducer,
        shoppingBag: ShoppingBagReducer,
        userShoppingBag: UserShoppingReducer ,
        address: addressReducer,
        userAddress: userAddressReducer,
        userShoppingBagHistory: UserShoppingHistoryReducer,
        message: MessageReducer,
        dashboard: dashboardReducer,
        bucket: bucketReducer,
        invoice: InvoiceReducer,
        notification: NotificationReducer,
        return: ReturnReducer,
        snackbar: SnackbarReducer,
        wishlist: WishlistReducer

    }
});