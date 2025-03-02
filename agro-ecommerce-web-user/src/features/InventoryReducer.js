import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

export const fetchAllInventories = createAsyncThunk(
    'inventory/fetchAllInventories',
    async (productId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${URL.inventoryUrl}/all`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const fetchInventoryByDateRange = createAsyncThunk(
    'inventory/fetchByDateRange',
    async ({ startDate, endDate }, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${URL.inventoryUrl}/date-range`, {
          params: { startDate, endDate }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const restockInventory = createAsyncThunk(
    'inventory/restock',
    async (restockData, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${URL.inventoryUrl}/restock`, restockData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );



const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(fetchAllInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch by Date Range
      .addCase(fetchInventoryByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(fetchInventoryByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Restock
      .addCase(restockInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restockInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories.push(action.payload);
      })
      .addCase(restockInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  }
});


export default inventorySlice.reducer;
