import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {URL} from '../utils/urlconfig';

// Async thunks for API calls
export const fetchUserCart = createAsyncThunk("cart/fetchUserCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.cartUrl}/user/${userId}/my-cart`);
    console.log('response cart:', response);
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const clearCart = createAsyncThunk("cart/clearCart", async (cartId, { rejectWithValue }) => {
  try {
    
    await axios.delete(`${URL.cartUrl}/${cartId}/clear`);
    console.log("cart cleared");
    
    return cartId;
  } catch (error) {
    console.log(error);
    
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addItemToCart = createAsyncThunk("cart/addItemToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL.cartItemUrl}/item/add`, null, {
      params: { productId, quantity },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeItemFromCart = createAsyncThunk("cart/removeItemFromCart", async ({ cartId, itemId }, { rejectWithValue }) => {
  try {
    await axios.delete(`${URL.cartItemUrl}/cart/${cartId}/item/${itemId}/remove`);
    return itemId;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ cartId, itemId, quantity }, { rejectWithValue }) => {
    try {
      await axios.put(`${URL.cartItemUrl}/cart/${cartId}/item/${itemId}/update`, null, {
        params: { quantity },
      });
      return { itemId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Initial state
const initialState = {
  cart: null,
  loading: false,
  error: null,
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user cart
    builder.addCase(fetchUserCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchUserCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Clear cart
    builder.addCase(clearCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearCart.fulfilled, (state) => {
      state.loading = false;
      state.cart = { ...state.cart, items: [], totalPrice: 0 };
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add item to cart
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Remove item from cart
    builder.addCase(removeItemFromCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.loading = false;
      // state.cart.items = state.cart.items.filter((item) => item.product.id !== action.payload);
    });
    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update item quantity
    builder.addCase(updateItemQuantity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
