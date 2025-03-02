import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    manufacturer: undefined,
    loading: false,
    error: '',
    manufacturers: []
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
    // console.log(api)
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

export const manufacturers = createAsyncThunk(
    'manufacturers',
    async ({token})=>{
        const result = await makeApiCall(`${URL.manufacturerUrl}`, token);
        return result;
    }
)

export const manufacturerByName = createAsyncThunk(
    'manufacturerByName',
    async ({manufacturerName, token})=>{
        const result = await makePostApiCall(`${URL.manufacturerUrl}/${manufacturerName}`,null, token);
        return result;
    }
)

export const manufacturerById = createAsyncThunk(
    'manufacturerById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.manufacturerUrl}/${id}`, token);
        return result;
    }
)
export const manufacturerToSaveApi = createAsyncThunk(
    'manufacturerToSave',
    async({manufacturer, token}) => {
        const result = await makePostApiCall(`${URL.manufacturerUrl}`,manufacturer,token);
        return result;
    }
)

export const manufacturerSlice = createSlice({
    name:"manufacturer",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(manufacturerToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.manufacturer = action.payload;
                }
            })
            .addCase(manufacturerById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.manufacturer = action.payload;
                } else {
                    state.manufacturer = undefined;
                }
            })
            .addCase(manufacturerByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.manufacturer = undefined;
                } else if (action.payload.id) {
                    state.manufacturer = action.payload;
                    state.error = '';
                }
            })
            .addCase(manufacturers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.manufacturers = undefined;
                } else if (action.payload) {
                    state.manufacturers = action.payload;
                    state.error = '';
                }
            })
            .addCase(manufacturers.pending, (state, action) => {
                state.loading = true;
                state.error = '';
                state.manufacturer = undefined;
            });
    }
    
});

export default manufacturerSlice.reducer;