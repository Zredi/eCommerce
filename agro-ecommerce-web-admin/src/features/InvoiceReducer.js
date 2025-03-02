// src/features/invoice/invoiceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {URL} from '../utils/urlconfig';


// Async thunks
export const fetchInvoiceByOrderId = createAsyncThunk(
  'invoice/fetchByOrderId',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.invoiceUrl}/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInvoiceBySaleId = createAsyncThunk(
  'invoice/fetchInvoiceBySaleId',
  async (saleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.invoiceUrl}/offline/${saleId}`);
      console.log("res inv", response);
      
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentInvoice: null,
  loading: false,
  error: null,
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchInvoiceByOrderId
      .addCase(fetchInvoiceByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch invoice';
      })


      .addCase(fetchInvoiceBySaleId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceBySaleId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceBySaleId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch invoice';
      });
  }
});

// Export actions
export const { clearCurrentInvoice, clearError } = invoiceSlice.actions;

// Export reducer
export default invoiceSlice.reducer;