import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.wishlistUrl}/${userId}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL.wishlistUrl}/add`, null, {
      params: { userId, productId }
    });
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ userId, productId }, { rejectWithValue }) => {
  try {
    await axios.delete(`${URL.wishlistUrl}/remove`, {
      params: { userId, productId }
    });
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    loading: false,
    error: null
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.wishlist.includes(action.payload)) {
          state.wishlist.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = state.wishlist.filter((id) => id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
