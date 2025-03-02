import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { URL } from '../utils/urlconfig';

const initialState = {
    shoppingBag: undefined,
    loading: false,
    error: '',
    shoppingBags: []
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

export const shoppingBags = createAsyncThunk(
    'shoppingBags',
    async ({token})=>{
        const result = await makeApiCall(`${URL.shoppingBagUrl}`, token);
        return result;
    }
)

export const shoppingBagByName = createAsyncThunk(
    'shoppingBagByName',
    async ({shoppingBagName, token})=>{
        const result = await makePostApiCall(`${URL.shoppingBagUrl}/${shoppingBagName}`,null, token);
        return result;
    }
)

export const shoppingBagById = createAsyncThunk(
    'shoppingBagById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.shoppingBagUrl}/${id}`, token);
        return result;
    }
)
export const  shoppingBagsByIds = createAsyncThunk(
    'shoppingBagsByIds',
    async ({id, token})=>{
        const result = await makePostApiCall(`${URL.shoppingBagUrl}/ByIds`,id, token);
        return result;
    }
)
export const  shoppingBagsByUserShoppingBagIds = createAsyncThunk(
    'shoppingBagsByUserShoppingBagIds',
    async ({id, token})=>{
        const result = await makePostApiCall(`${URL.shoppingBagUrl}/getByUserShoppingBagIds`,id, token);
        return result;
    }
)
export const shoppingBagToSaveApi = createAsyncThunk(
    'shoppingBagToSave',
    async({shoppingBag, token}) => {
        const result = await makePostApiCall(`${URL.shoppingBagUrl}`,shoppingBag,token);
        return result;
    }
)

export const shoppingBagSlice = createSlice({
    name:"shoppingBag",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(shoppingBagsByUserShoppingBagIds.fulfilled, (state, action) => {
                state.loading = false;
                state.shoppingBag = action.payload ? action.payload : undefined;
            })
            .addCase(shoppingBagsByIds.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.shoppingBags = action.payload;
                }
            })
            .addCase(shoppingBagToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.shoppingBag = action.payload;
                }
            })
            .addCase(shoppingBagById.fulfilled, (state, action) => {
                state.loading = false;
                state.shoppingBag = action.payload ? action.payload : undefined;
            })
            .addCase(shoppingBagByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.shoppingBag = undefined;
                } else if (action.payload.id) {
                    state.shoppingBag = action.payload;
                    state.error = '';
                }
            })
            .addCase(shoppingBags.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.shoppingBags = undefined;
                } else if (action.payload) {
                    state.shoppingBags = action.payload;
                    state.error = '';
                }
            })
            .addCase(shoppingBags.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.shoppingBag = undefined;
            });
    }
    
});

export default shoppingBagSlice.reducer;