import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    subUnit: undefined,
    loading: false,
    error: '',
    subUnits: undefined
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

export const subUnits = createAsyncThunk(
    'subUnits',
    async ({token})=>{
        // console.log(token)
        const result = await makeApiCall(`${URL.subUnitUrl}`, token);
        return result;
    }
)

export const subUnitByName = createAsyncThunk(
    'subUnitByName',
    async ({subUnitName, token})=>{
        const result = await makePostApiCall(`${URL.subUnitUrl}/${subUnitName}`,null, token);
        return result;
    }
)

export const subUnitById = createAsyncThunk(
    'subUnitById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.subUnitUrl}/${id}`, token);
        return result;
    }
)
export const subUnitToSaveApi = createAsyncThunk(
    'subUnitToSave',
    async({subUnit, token}) => {
        const result = await makePostApiCall(`${URL.subUnitUrl}`,subUnit,token);
        return result;
    }
)

export const subUnitSlice = createSlice({
    name:"subUnit",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(subUnitToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.subUnit = action.payload;
                }
            })
            .addCase(subUnitById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.subUnit = action.payload;
                } else {
                    state.subUnit = undefined;
                }
            })
            .addCase(subUnitByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.subUnit = undefined;
                } else if (action.payload.id) {
                    state.subUnit = action.payload;
                    state.error = '';
                }
            })
            .addCase(subUnits.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.subUnits = undefined;
                } else if (action.payload) {
                    state.subUnits = action.payload;
                    state.error = '';
                }
            })
            .addCase(subUnits.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.subUnit = undefined;
            });
    }
    
});

export default subUnitSlice.reducer;