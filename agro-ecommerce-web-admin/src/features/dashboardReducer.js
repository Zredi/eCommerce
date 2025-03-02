import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URL } from '../utils/urlconfig';

const initialState = {
    orderCount: undefined,
    totalSales: undefined,
    totalUsers: undefined,
    stocksCount: undefined,
    loading: false,
    error: '',
}

const makeApiCall = async (api, token = "") => {
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },

    })
    return await res.json();
}
const makePostApiCall = async (api, body, token = "") => {
    const res = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body)

    })
    // console.log(res.json())
    return await res.json();
}



export const getTotalOrderCount = createAsyncThunk(
    'getTotalOrderCount',
    async ({ token }) => {
        const result = await makeApiCall(`${URL.DashboardUrl}/orderCount`, token)
        return result;
    }
)


export const getTotalSales = createAsyncThunk(
    'getTotalSales',
    async ({ token }) => {
        const result = await makeApiCall(`${URL.DashboardUrl}/totalSales`, token)
        return result;
    }
)

export const getTotalUsers = createAsyncThunk(
    'getTotalUsers',
    async ({ token }) => {
        const result = await makeApiCall(`${URL.DashboardUrl}/usersCount`, token)
        return result;
    }
)

export const getTotalStocks = createAsyncThunk(
    'getTotalStocks',
    async ({ token }) => {
        const result = await makeApiCall(`${URL.DashboardUrl}/stocksCount`, token)
        return result;
    }
)


export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTotalStocks.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.stocksCount = action.payload;
                }
            })
            .addCase(getTotalUsers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.totalUsers = action.payload;
                }
            })
            .addCase(getTotalSales.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.totalSales = action.payload;
                }
            })
            .addCase(getTotalOrderCount.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.orderCount = action.payload;
                } else {
                    state.orderCount = 0;
                }
            })
            .addCase(getTotalOrderCount.pending, (state, action) => {
                state.loading = true;
                state.error = '';
                state.orderCount = 0;
            });
    }
    
});

export default orderSlice.reducer;