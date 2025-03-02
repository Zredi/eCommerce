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
import InventoryReducer from "./InventoryReducer";
import CategoryReducer from "./CategoryReducer";
import SubCategoryReducer from "./SubCategoryReducer";
import OrderReducer from "./OrderReducer";
import ShoppingBagReducer from "./ShoppingBagReducer";
import addressReducer from "./addressReducer";
import userAddressReducer from "./userAddressReducer";
import MessageReducer from "./MessageReducer";
import dashboardReducer from "./dashboardReducer";
import bucketReducer from "./bucketReducer";
import InvoiceReducer from "./InvoiceReducer";
import NotificationReducer from "./NotificationReducer";
import ReturnReducer from "./ReturnReducer";
import salesReducer from "./salesReducer";
import snackbarReducer from "./snackbarReducer";

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
        inventory: InventoryReducer,
        category: CategoryReducer,
        subCategory: SubCategoryReducer,
        order: OrderReducer,
        shoppingBag: ShoppingBagReducer,
        address: addressReducer,
        userAddress: userAddressReducer,
        message: MessageReducer,
        dashboard: dashboardReducer,
        bucket: bucketReducer,
        invoice: InvoiceReducer,
        notification: NotificationReducer,
        return: ReturnReducer,
        sales: salesReducer,
        snackbar: snackbarReducer

    }
});