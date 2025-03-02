import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    userShoppingBag: undefined,
    loading: false,
    error: '',
    userShoppingBags: []
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
const makeDeleteApiCall = async (api, body, token = "") => {
    const res = await fetch(api, {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
        },
        body:JSON.stringify(body)
        
    })
}

export const userShoppingBags = createAsyncThunk(
    'userShoppingBags',
    async ({token})=>{
        const result = await makeApiCall(`${URL.userShoppingBagUrl}`, token);
        return result;
    }
)

export const userShoppingBagByName = createAsyncThunk(
    'userShoppingBagByName',
    async ({userShoppingBagName, token})=>{
        const result = await makePostApiCall(`${URL.userShoppingBagUrl}/${userShoppingBagName}`,null, token);
        return result;
    }
)

export const userShoppingBagById = createAsyncThunk(
    'userShoppingBagById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.userShoppingBagUrl}/${id}`, token);
        return result;
    }
)
export const userShoppingBagByUserId = createAsyncThunk(
    'userShoppingBagByUserId',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.userShoppingBagUrl}/byUserId/${id}`, token);
        return result;
    }
)

export const userShoppingBagToSaveApi = createAsyncThunk(
    'userShoppingBagToSave',
    async({userShoppingBag, token}) => {
        console.log(userShoppingBag)
        const result = await makePostApiCall(`${URL.userShoppingBagUrl}`,userShoppingBag,token);
        return result;
    }
)

export const userShoppingBagToDeleteApi = createAsyncThunk(
    'userShoppingBagToDelete',
    async({userShoppingBag, token}) => {
        console.log(userShoppingBag)
        const result = await makeDeleteApiCall(`${URL.userShoppingBagUrl}`,userShoppingBag,token);
        return result;
    }
)

export const userShoppingBagSlice = createSlice({
    name:"userShoppingBag",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(userShoppingBagToDeleteApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBag = action.payload;
                }
            })
            .addCase(userShoppingBagToDeleteApi.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.userShoppingBag = undefined;
            })
            .addCase(userShoppingBagByUserId.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBags = action.payload;
                }
            })
            .addCase(userShoppingBagToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBag = action.payload;
                }
            })
            .addCase(userShoppingBagById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBag = action.payload;
                } else {
                    state.userShoppingBag = undefined;
                }
            })
            .addCase(userShoppingBagByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userShoppingBag = undefined;
                } else if (action.payload.id) {
                    state.userShoppingBag = action.payload;
                    state.error = '';
                }
            })
            .addCase(userShoppingBags.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userShoppingBags = undefined;
                } else if (action.payload) {
                    state.userShoppingBags = action.payload;
                    state.error = '';
                }
            })
            .addCase(userShoppingBags.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.userShoppingBag = undefined;
            });
    }
    
});

export default userShoppingBagSlice.reducer;