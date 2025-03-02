import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../utils/urlconfig";

const initialState = {
    authData: undefined,
    loading: false,
    error: '',
}

const makeApiCall = async (api, body, token="")=>{
    try{
        const res = await fetch(api, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(body)
        })
        return await res.json();
    }
    catch(err){
        throw err;
    }
    
}

export const signupApi = createAsyncThunk(
    'signupApi',
    async (body)=>{
        try{
            const result = await makeApiCall(URL.signupUrl, body);
            return result;
        }
        catch(err){
            throw err;
        }
       
    }
)

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers:{
        logout: (state, action)=>{
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            state.authData = undefined
            state.loading = false
            state.error = undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.authData = undefined;
                } else if (action.payload.jwt) {
                    state.authData = action.payload;
                    state.error = '';
                    localStorage.setItem('token', action.payload.jwt);
                    localStorage.setItem('userId', action.payload.userId);
                }
            })
            .addCase(signupApi.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.authData = undefined;
            });
    }
    
});

export const {logout} =signupSlice.actions;
export default signupSlice.reducer;