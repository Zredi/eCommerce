import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

export const fetchAllStocks = createAsyncThunk(
    'stock/fetchAllStocks',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${URL.stockUrl}/all`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const fetchStockByProductId = createAsyncThunk(
  'stock/fetchStockByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.stockUrl}/${productId}`);
      console.log("Stock", response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)
  
  


const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stocks: [],
    stock: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStock: (state) => {
      state.stock = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchAllStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(fetchStockByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.stock = action.payload;
      })
      .addCase(fetchStockByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const { resetStock } = stockSlice.actions;
export default stockSlice.reducer;
