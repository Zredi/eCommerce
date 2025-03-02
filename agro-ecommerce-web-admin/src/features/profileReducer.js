import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {URL} from '../utils/urlconfig';
const initialState = {
    profileData: undefined,
    loading: false,
    error: undefined,
}

const makeApiCall = async (api, accessToken="")=>{
    const res = await fetch(api, {
        method:"GET",
        headers:{
            "Authorization":`Bearer ${accessToken}`,
        }
    })
    return await res.json();
}
const makePostApiCall = async (api,formData, accessToken="")=>{
    const res = await fetch(api, {
        method:"POST",
        headers:{
            "Authorization":`Bearer ${accessToken}`,
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(formData)
    })
    return await res.json();
}
export const profileApi = createAsyncThunk(
    'profileApi',
    async ({userId, jwt})=>{
        const result = await makeApiCall(`${URL.profileUrl}/findByUserId/${userId}`, jwt);
        return result;
    }
)
export const profileApiByUserId = createAsyncThunk(
    'profileApiByUserId',
    async ({userId, token})=>{
        const result = await makePostApiCall(`${URL.profileUrl}/findByUserId`,userId, token);
        return result;
    }
)


export const profileUpdateApi = createAsyncThunk(
    'profileUpdateApi',
    async ({userId,formData, jwt})=>{

        console.log("form data:", formData);
        
        const result = await makePostApiCall(`${URL.profileUrl}/updateProfile/${userId}`,formData, jwt);
        console.log('Action Payload:', result);
        return result;
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers:{
        logout: (state, action)=>{
            state.profileData=undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(profileApiByUserId.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.profileData = undefined;
                } else if (action.payload) {
                    state.profileData = action.payload;
                    state.error = undefined;
                }
            })
            .addCase(profileUpdateApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.profileData = action.payload;
                    state.error = undefined;
                }
            })
            .addCase(profileApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.profileData = undefined;
                } else if (action.payload) {
                    state.profileData = action.payload;
                    state.error = undefined;
                }
            })
            .addCase(profileApi.pending, (state) => {
                state.loading = true;
                state.error = undefined;
                state.token = undefined;
            })
            .addCase(profileApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.userData = undefined;
            });
    }
    
});

export const {addToken, logout} =profileSlice.actions;
export default profileSlice.reducer;