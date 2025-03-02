import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    userAddress: undefined,
    loading: false,
    error: '',
    userAddresss: []
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

export const userAddresss = createAsyncThunk(
    'userAddresss',
    async ({token})=>{
        const result = await makeApiCall(`${URL.userAddressUrl}`, token);
        return result;
    }
)

export const userAddressByName = createAsyncThunk(
    'userAddressByName',
    async ({userAddressName, token})=>{
        const result = await makePostApiCall(`${URL.userAddressUrl}/${userAddressName}`,null, token);
        return result;
    }
)

export const userAddressById = createAsyncThunk(
    'userAddressById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.userAddressUrl}/${id}`, token);
        return result;
    }
)
export const userAddressToSaveApi = createAsyncThunk(
    'userAddressToSave',
    async({userAddress, token}) => {
        const result = await makePostApiCall(`${URL.userAddressUrl}`,userAddress,token);
        return result;
    }
)

export const UserAddressSlice = createSlice({
    name:"userAddress",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(userAddressToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userAddress = action.payload;
                }
            })
            .addCase(userAddressById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userAddress = action.payload;
                } else {
                    state.userAddress = undefined;
                }
            })
            .addCase(userAddressByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userAddress = undefined;
                } else if (action.payload.id) {
                    state.userAddress = action.payload;
                    state.error = '';
                }
            })
            .addCase(userAddresss.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userAddresss = undefined;
                } else if (action.payload) {
                    state.userAddresss = action.payload;
                    state.error = '';
                }
            })
            .addCase(userAddresss.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.userAddress = undefined;
            });
    }
    
});

export default UserAddressSlice.reducer;