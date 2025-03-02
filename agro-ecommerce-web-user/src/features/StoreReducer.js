import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    store: undefined,
    loading: false,
    error: '',
    stores: []
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

export const stores = createAsyncThunk(
    'stores',
    async ({token})=>{
        const result = await makeApiCall(`${URL.storeUrl}`, token);
        return result;
    }
)

export const storeByName = createAsyncThunk(
    'storeByName',
    async ({storeName, token})=>{
        const result = await makePostApiCall(`${URL.storeUrl}/${storeName}`,null, token);
        return result;
    }
)

export const storeById = createAsyncThunk(
    'storeById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.storeUrl}/${id}`, token);
        return result;
    }
)
export const storeToSaveApi = createAsyncThunk(
    'storeToSave',
    async({store, token}) => {
        const result = await makePostApiCall(`${URL.storeUrl}`,store,token);
        return result;
    }
)

export const storeSlice = createSlice({
    name:"store",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(storeToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.store = action.payload;
                }
            })
            .addCase(storeById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.store = action.payload;
                } else {
                    state.store = undefined;
                }
            })
            .addCase(storeByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.store = undefined;
                } else if (action.payload.id) {
                    state.store = action.payload;
                    state.error = '';
                }
            })
            .addCase(stores.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.stores = undefined;
                } else if (action.payload) {
                    state.stores = action.payload;
                    state.error = '';
                }
            })
            .addCase(stores.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.store = undefined;
            });
    }
    
});

export default storeSlice.reducer;