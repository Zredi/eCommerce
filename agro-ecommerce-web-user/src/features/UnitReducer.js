import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { json } from 'react-router-dom';
import { URL } from '../utils/urlconfig';

const initialState = {
    unit: undefined,
    loading: false,
    error: '',
    units: []
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

export const units = createAsyncThunk(
    'units',
    async ({token})=>{
        const result = await makeApiCall(`${URL.unitUrl}`, token);
        return result;
    }
)

export const unitByName = createAsyncThunk(
    'unitByName',
    async ({unitName, token})=>{
        const result = await makePostApiCall(`${URL.unitUrl}/${unitName}`,null, token);
        return result;
    }
)

export const unitById = createAsyncThunk(
    'unitById',
    async ({id, token})=>{
        const result = await makeApiCall(`${URL.unitUrl}/${id}`, token);
        return result;
    }
)
export const unitToSaveApi = createAsyncThunk(
    'unitToSave',
    async({unit, token}) => {
        const result = await makePostApiCall(`${URL.unitUrl}`,unit,token);
        return result;
    }
)

export const unitSlice = createSlice({
    name:"unit",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(unitToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.unit = action.payload;
                }
            })
            .addCase(unitById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.unit = action.payload;
                } else {
                    state.unit = undefined;
                }
            })
            .addCase(unitByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.unit = undefined;
                } else if (action.payload.id) {
                    state.unit = action.payload;
                    state.error = '';
                }
            })
            .addCase(units.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.units = undefined;
                } else if (action.payload) {
                    state.units = action.payload;
                    state.error = '';
                }
            })
            .addCase(units.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.unit = undefined;
            });
    }
    
});

export default unitSlice.reducer;