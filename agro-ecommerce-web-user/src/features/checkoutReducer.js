import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from '../utils/urlconfig';

// Async thunks
export const fetchAddresses = createAsyncThunk(
    "checkout/fetchAddresses",
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
    "checkout/fetchAddressById",
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
    "checkout/addNewAddress",
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
    "checkout/deleteAddress",
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${URL.addressUrl}/${addressId}`);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const placeOrder = createAsyncThunk(
    "checkout/placeOrder",
    async ({ userId, addressId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${URL.orderUrl}/order`, null, {
                params: { userId, addressId },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    currentStep: 1,
    addresses: [],
    selectedAddress: null,
    paymentMethod: 'cod',
    loading: false,
    error: null,
    orderPlaced: false,
    orderId: null
};

// Slice
const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        selectAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        resetCheckout: (state) => {
            return initialState;
        }
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
        });

        // Place order cases
        builder.addCase(placeOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(placeOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orderPlaced = true;
            state.orderId = action.payload.orderId;
        });
        builder.addCase(placeOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const {
    setCurrentStep,
    selectAddress,
    setPaymentMethod,
    resetCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;