import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {URL} from '../utils/urlconfig';

// Fetch all orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.orderUrl}`);
    // console.log('response', response);
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch a specific order by ID
export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.orderUrl}/${id}/order`);
    console.log('order by id', response);
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//Fetch order by userId
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (userId, { rejectWithValue }) => {
  try{
    const response = await axios.get(`${URL.orderUrl}/user/${userId}/order`);
    console.log('order response', response);
    
    return response.data.data;
  }catch (error){
    return rejectWithValue(error.response?.data)
  }
})

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL.orderUrl}/${orderId}/status?status=${status}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

// Order Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [], 
    userOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    statusUpdateLoading: false,
    statusUpdateError:null
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearStatusUpdateError: (state) => {
      state.statusUpdateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
        
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userOrders = [];
      })

      // Update order
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        // Update in orders array
        const orderIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
        
        // Update in userOrders array
        const userOrderIndex = state.userOrders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = action.payload;
        }
        
        // Update selectedOrder if it's the same order
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload?.message || 'Failed to update order status';
      });
  }
});

export const { setSelectedOrder, clearStatusUpdateError } = orderSlice.actions;
export default orderSlice.reducer;
