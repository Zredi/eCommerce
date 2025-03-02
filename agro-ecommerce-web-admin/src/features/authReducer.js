import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {URL} from '../utils/urlconfig';

const initialState = {
    authData: undefined,
    loading: false,
    error: undefined,
}

const makeApiCall = async (api, values, token="")=>{
    const res = await fetch(api, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(values)
    })
    return await res.json();
}
//https://image-blog-backend.herokuapp.com/api/ping
//http://localhost:8080/authenticate
export const signinApi = createAsyncThunk(
    'signin',
    async (values)=>{
        // const dispatch = useDispatch();
        console.log(URL.signInUrl)
        const result = await makeApiCall(URL.signInUrl, values);
        // dispatch(addToken())
        
        return result.data;
    }
)
export const signUpApi = createAsyncThunk(
    'signUp',
    async ({user})=>{
        // const dispatch = useDispatch();
        // console.log(user);
        const result = await makeApiCall(URL.signupUrl, user);
        // dispatch(addToken())
        // console.log(result);
        
        return result.data;
    }
)
// export const authDataFromLocalStorage = () =>{
//     let userId = JSON.parse(localStorage.getItem("userId"))
//     let token = JSON.parse(localStorage.getItem("token"))
//     if(userId){
//         dispatch(profileApiByUserId).then((data) => {
//             initialState.authData = data.payload ;
//         })
//     }
// }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        addToken: (state, action)=>{
            if(localStorage.getItem('token')){
                state.authData= {token:'', userId:''};
                state.authData.token=localStorage.getItem('token');
                state.authData.userId=localStorage.getItem('userId');
            }
            else{
                state.authData=undefined;
                state.loading=false;
                state.error=undefined
            }
        },
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
            .addCase(signinApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.authData = undefined;
                } else if (action.payload.token) {
                    state.authData = action.payload;
                    state.error = undefined;
                    localStorage.setItem('token', action.payload.token);
                    localStorage.setItem('userId', action.payload.id);
                }
            })
            .addCase(signinApi.pending, (state, action) => {
                state.loading = true;
                state.error = undefined;
                state.authData = undefined;
            })
            .addCase(signUpApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpApi.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                
            })
            .addCase(signUpApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
    
});

export const {addToken, logout} =authSlice.actions;
export default authSlice.reducer;