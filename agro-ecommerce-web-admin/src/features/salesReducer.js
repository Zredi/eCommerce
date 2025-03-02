import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

// Async Thunks
export const createOfflineSale = createAsyncThunk(
  'sales/createOfflineSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL.salesUrl}/create`, saleData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  'sales/fetchSaleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.salesUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllSales = createAsyncThunk(
  'sales/fetchAllSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.salesUrl}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSalesByDateRange = createAsyncThunk(
  'sales/fetchSalesByDateRange',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.salesUrl}/by-date-range`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  sales: [],
  selectedSale: null,
  loading: false,
  error: null,
  successMessage: null
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearSelectedSale: (state) => {
      state.selectedSale = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOfflineSale
      .addCase(createOfflineSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOfflineSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);
        state.successMessage = 'Sale created successfully!';
      })
      .addCase(createOfflineSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create sale';
      })

      // fetchSaleById
      .addCase(fetchSaleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch sale';
      })

      // fetchAllSales
      .addCase(fetchAllSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchAllSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch sales';
      })

      // fetchSalesByDateRange
      .addCase(fetchSalesByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSalesByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch sales for date range';
      });
  }
});

export const { clearSelectedSale, clearError, clearSuccessMessage } = salesSlice.actions;
export default salesSlice.reducer; 