import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {URL} from '../utils/urlconfig';

export const requestReturn = createAsyncThunk(
  "returns/requestReturn",
  async ({ userId, orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL.returnUrl}/request`, null, {
        params: { userId, orderId, reason },
      });
      console.log('return response', response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllReturns = createAsyncThunk(
  "returns/getAllReturns",
  async ( _,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.returnUrl}/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserReturns = createAsyncThunk(
  "returns/getUserReturns",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.returnUrl}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getReturnByOrder = createAsyncThunk(
  "returns/getReturnByOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL.returnUrl}/order/${orderId}`);
      console.log("returnby order", response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReturnStatus = createAsyncThunk(
  "returns/updateReturnStatus",
  async ({ returnId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${URL.returnUrl}/${returnId}/status`, null, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const returnSlice = createSlice({
  name: "returns",
  initialState: {
    returns: [],
    singleReturn:null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestReturn.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.returns.push(action.payload);
      })
      .addCase(requestReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(getAllReturns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.returns = action.payload;
      })
      .addCase(getAllReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getUserReturns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.returns = action.payload;
      })
      .addCase(getUserReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReturnByOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReturnByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.singleReturn = action.payload;
      })
      .addCase(getReturnByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReturnStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.returns.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.returns[index] = action.payload;
        }
      })
      .addCase(updateReturnStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default returnSlice.reducer;
