import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {URL} from '../utils/urlconfig';

const initialState = {
    image: undefined,
    loading: false,
    error: undefined,
}

const makeApiCall = async (api, values, token="")=>{
    console.log(values)
    const res = await fetch(api, {
        method:"POST",
        headers:{
            // 'Content-Type': 'multipart/form-data',
            "Authorization":`Bearer ${token}`
        },
        body: values
    })
    return await res.json();
}
export const fileSaveInBucket = createAsyncThunk(
    'fileSaveInBucket',
    async ({formData})=>{
        console.log(URL.bucketUrl)
        const result = await makeApiCall(`${URL.bucketUrl}/upload`, formData);
        return result;
    }
)

const bucketSlice = createSlice({
    name: 'bucket',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(fileSaveInBucket.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.image = undefined;
                } else if (action.payload) {
                    state.image = action.payload;
                    state.error = undefined;
                }
            })
            .addCase(fileSaveInBucket.pending, (state, action) => {
                state.loading = true;
                state.error = undefined;
                state.authData = undefined;
            });
    }
    
});

export default bucketSlice.reducer;