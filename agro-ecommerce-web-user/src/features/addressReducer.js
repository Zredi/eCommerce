import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from '../utils/urlconfig';

// Async thunks
export const fetchAddresses = createAsyncThunk(
    "address/fetchAddresses",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.addressUrl}/${userId}/addresses`);
            console.log("addresses", response);
          
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchAddressById = createAsyncThunk(
    "address/fetchAddressById",
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.addressUrl}/${addressId}/address`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addNewAddress = createAsyncThunk(
    "address/addNewAddress",
    async ({ userId, address }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${URL.addressUrl}/add/${userId}`, address);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${URL.addressUrl}/${addressId}`);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAddress = createAsyncThunk(
    "address/updateAddress",
    async ({ addressId, address }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${URL.addressUrl}/${addressId}`, address);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        selectAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch addresses cases
        builder.addCase(fetchAddresses.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAddresses.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = action.payload;
        });
        builder.addCase(fetchAddresses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch address by ID cases
        builder.addCase(fetchAddressById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAddressById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedAddress = action.payload;
        });
        builder.addCase(fetchAddressById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Add new address cases
        builder.addCase(addNewAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addNewAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses.push(action.payload);
            state.selectedAddress = action.payload;
        });
        builder.addCase(addNewAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete address cases
        builder.addCase(deleteAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = state.addresses.filter(
                (address) => address.id !== action.payload
            );
            if (state.selectedAddress?.id === action.payload) {
                state.selectedAddress = null;
            }
        });
        builder.addCase(deleteAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        builder.addCase(updateAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
            state.selectedAddress = action.payload;
        });
        builder.addCase(updateAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const {selectAddress} = addressSlice.actions;

export default addressSlice.reducer;