import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { URL } from '../utils/urlconfig';

const initialState = {
    mailMessage: undefined,
    wpMessage: undefined,
    loading: false,
    error: '',
    messages: []
}

const makePostApiCall = async (api,body,  token="")=>{
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

export const sendMailMessage = createAsyncThunk(
    'sendMailMessage',
    async({message, token}) => {
        const result = await makePostApiCall(`${URL.mailMessageUrl}`,message,token);
        return result;
    }
)
export const sendWpMessage = createAsyncThunk(
    'sendWpMessage',
    async({message, token}) => {
        const result = await makePostApiCall(`${URL.whatsAppMsgUrl}`,message,token);
        return result;
    }
)

export const messageSlice = createSlice({
    name:"message",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMailMessage.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.mailMessage = action.payload;
                } else {
                    state.mailMessage = undefined;
                }
            })
            .addCase(sendMailMessage.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(sendWpMessage.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.wpMessage = action.payload;
                } else {
                    state.wpMessage = undefined;
                }
            })
            .addCase(sendWpMessage.pending, (state, action) => {
                state.loading = true;
            });
    }
    
});

export default messageSlice.reducer;