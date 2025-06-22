import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';


// Async Thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.productUrl}`);

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL.productUrl}/add`, productData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${URL.productUrl}/product/${id}/update`, productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${URL.productUrl}/product/${id}/delete`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductsByCategory = createAsyncThunk('products/fetchProductsByCategory', async (Category, { rejectWithValue }) => {
  try {

    const response = await axios.get(`${URL.productUrl}/product/${Category}/all/products`);
    console.log('response', response);

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductsBySubCategory = createAsyncThunk('products/fetchProductsBySubCategory', async (subCategory, { rejectWithValue }) => {
  try {

    const response = await axios.get(`${URL.productUrl}/product/subcategory/${subCategory}/all/products`);
    console.log('response', response);

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {

    const response = await axios.get(`${URL.productUrl}/product/${id}/product`);
    console.log('response', response);
    return response.data.data;

  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const submitReview = createAsyncThunk('products/submitReview', async ({ productId, review }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL.productUrl}/product/${productId}/review`, review);
    return response.data.data; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductReviews = createAsyncThunk('products/fetchProductReviews', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.productUrl}/product/${productId}/reviews`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
    reviews: [],
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    resetProducts: (state) => {
      state.products = [];
      state.error = null;
      state.reviews = [];
    },
    resetReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductsBySubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsBySubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsBySubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })


      .addCase(submitReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { resetProducts, setSelectedProduct, resetReviews } = productSlice.actions;
export default productSlice.reducer;
