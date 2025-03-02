import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    userShoppingBagHistory: undefined,
    loading: false,
    error: '',
    userShoppingBagHistories: []
}

const makeApiCall = async (api,  token="")=>{
    const res = await fetch(api, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
        },
        
    })
    return await res.json();
}
const makePostApiCall = async (api,body,  token="")=>{
    console.log(api)
    const res = await fetch(api, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
        },
        body:JSON.stringify(body)
        
    })
    return await res.json();
}

export const userShoppingBagHistories = createAsyncThunk(
    'userShoppingBagHistories',
    async ({token})=>{
        const result = await makeApiCall(`${URL.userShoppingBagUrl}`, token);
        return result;
    }
)


// export const userShoppingBagById = createAsyncThunk(
//     'userShoppingBagById',
//     async ({id, token})=>{
//         const result = await makeApiCall(`${URL.userShoppingBagUrl}/${id}`, token);
//         return result;
//     }
// )
// export const userShoppingBagByUserId = createAsyncThunk(
//     'userShoppingBagByUserId',
//     async ({id, token})=>{
//         const result = await makeApiCall(`${URL.userShoppingBagUrl}/byUserId/${id}`, token);
//         return result;
//     }
// )

export const userShoppingBagHistoryToSaveApi = createAsyncThunk(
    'userShoppingBagHistoryToSave',
    async({userShoppingBagHistory, token}) => {
        console.log(userShoppingBagHistory)
        const result = await makePostApiCall(`${URL.userShoppingBagUrl}`,userShoppingBagHistory,token);
        return result;
    }
)

export const userShoppingBagHistorySlice = createSlice({
    name:"userShoppingBagHistory",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(userShoppingBagHistoryToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBagHistory = action.payload;
                }
            })
            .addCase(userShoppingBagHistories.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userShoppingBagHistorys = undefined;
                } else if (action.payload) {
                    state.userShoppingBagHistorys = action.payload;
                    state.error = '';
                }
            })
            .addCase(userShoppingBagHistories.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.userShoppingBagHistory = undefined;
            });
    }
    
});

export default userShoppingBagHistorySlice.reducer;