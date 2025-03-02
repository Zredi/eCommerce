import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { URL } from '../utils/urlconfig';

const initialState = {
    address: undefined,
    loading: false,
    error: '',
    addresss: []
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

export const addresss = createAsyncThunk(
    'addresss',
    async ({token})=>{
        const result = await makeApiCall(`${URL.addressUrl}`, token);
        return result;
    }
)

export const addressByName = createAsyncThunk(
    'addressByName',
    async ({addressName, token})=>{
        const result = await makePostApiCall(`${URL.addressUrl}/${addressName}`,null, token);
        return result;
    }
)

export const addressById = createAsyncThunk(
    'addressById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.addressUrl}/${id}`, token);
        return result;
    }
)
export const addressToSaveApi = createAsyncThunk(
    'addressToSave',
    async({address, token}) => {
        const result = await makePostApiCall(`${URL.addressUrl}`,address,token);
        return result;
    }
)

export const addressSlice = createSlice({
    name:"address",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(addressToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.address = action.payload;
                }
            })
            .addCase(addressById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.address = action.payload;
                } else {
                    state.address = undefined;
                }
            })
            .addCase(addressByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.address = undefined;
                } else if (action.payload.id) {
                    state.address = action.payload;
                    state.error = '';
                }
            })
            .addCase(addresss.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.addresss = undefined;
                } else if (action.payload) {
                    state.addresss = action.payload;
                    state.error = '';
                }
            })
            .addCase(addresss.pending, (state, action) => {
                state.loading = true;
                state.error = '';
                state.address = undefined;
            });
    }
    
});

export default addressSlice.reducer;