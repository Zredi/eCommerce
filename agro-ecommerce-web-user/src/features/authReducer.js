// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import {URL} from '../utils/urlconfig';

// const initialState = {
//     authData: undefined,
//     loading: false,
//     error: undefined,
// }

// const makeApiCall = async (api, values, token="")=>{
//     const res = await fetch(api, {
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json",
//         },
//         body: JSON.stringify(values)
//     })
//     return await res.json();
// }
// //https://image-blog-backend.herokuapp.com/api/ping
// //http://localhost:8080/authenticate
// export const signinApi = createAsyncThunk(
//     'signin',
//     async (values)=>{
//         // const dispatch = useDispatch();
//         console.log(URL.signInUrl)
//         const result = await makeApiCall(URL.signInUrl, values);
//         // dispatch(addToken())
        
//         return result.data;
//     }
// )
// export const signUpApi = createAsyncThunk(
//     'signUp',
//     async ({user})=>{
//         // const dispatch = useDispatch();
//         // console.log(user);
//         const result = await makeApiCall(URL.signupUrl, user);
//         // dispatch(addToken())
//         // console.log(result);
        
//         return result.data;
//     }
// )
// // export const authDataFromLocalStorage = () =>{
// //     let userId = JSON.parse(localStorage.getItem("userId"))
// //     let token = JSON.parse(localStorage.getItem("token"))
// //     if(userId){
// //         dispatch(profileApiByUserId).then((data) => {
// //             initialState.authData = data.payload ;
// //         })
// //     }
// // }

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers:{
//         addToken: (state, action)=>{
//             if(localStorage.getItem('token')){
//                 state.authData= {token:'', userId:''};
//                 state.authData.token=localStorage.getItem('token');
//                 state.authData.userId=localStorage.getItem('userId');
//             }
//             else{
//                 state.authData=undefined;
//                 state.loading=false;
//                 state.error=undefined
//             }
//         },
//         logout: (state, action)=>{
//             localStorage.removeItem('token')
//             localStorage.removeItem('userId')
//             state.authData = undefined
//             state.loading = false
//             state.error = undefined
//         }

//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(signinApi.fulfilled, (state, action) => {
//                 state.loading = false;
//                 if (action.payload.message) {
//                     state.error = action.payload.message;
//                     state.authData = undefined;
//                 } else if (action.payload.token) {
//                     state.authData = action.payload;
//                     state.error = undefined;
//                     localStorage.setItem('token', action.payload.token);
//                     localStorage.setItem('userId', action.payload.id);
//                 }
//             })
//             .addCase(signinApi.pending, (state, action) => {
//                 state.loading = true;
//                 state.error = undefined;
//                 state.authData = undefined;
//             })
//             .addCase(signUpApi.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(signUpApi.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.error = null;
                
//             })
//             .addCase(signUpApi.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     }
    
// });

// export const {addToken, logout} =authSlice.actions;
// export default authSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from '../utils/urlconfig';

// Utility function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp; // True if token is expired
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return true; // Treat as expired if decoding fails
  }
};

const initialState = {
  authData: null, // Changed from undefined to null for better type safety
  loading: false,
  error: null,    // Changed from undefined to null
};

const makeApiCall = async (api, values, token = "") => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Add token if provided
  }
  const res = await fetch(api, {
    method: "POST",
    headers,
    body: JSON.stringify(values),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
};

export const signinApi = createAsyncThunk(
  'auth/signin',
  async (values, { rejectWithValue }) => {
    try {
      const result = await makeApiCall(URL.signInUrl, values);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpApi = createAsyncThunk(
  'auth/signUp',
  async ({ user }, { rejectWithValue }) => {
    try {
      const result = await makeApiCall(URL.signupUrl, user);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addToken: (state) => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId && !isTokenExpired(token)) {
        state.authData = { token, userId };
      } else {
        state.authData = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      state.authData = null;
      state.loading = false;
      state.error = null;
    },
    validateToken: (state) => {
      const token = state.authData?.token || localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        state.authData = {
          token,
          userId: state.authData?.userId || localStorage.getItem('userId'),
        };
      } else {
        state.authData = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign-in cases
      .addCase(signinApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authData = null;
      })
      .addCase(signinApi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.message) {
          state.error = action.payload.message;
          state.authData = null;
        } else if (action.payload.token) {
          state.authData = {
            token: action.payload.token,
            userId: action.payload.id,
          };
          state.error = null;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('userId', action.payload.id);
        }
      })
      .addCase(signinApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign-in failed";
        state.authData = null;
      })
      // Sign-up cases
      .addCase(signUpApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpApi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.authData = {
            token: action.payload.token,
            userId: action.payload.id,
          };
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('userId', action.payload.id);
        }
        state.error = null;
      })
      .addCase(signUpApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign-up failed";
        state.authData = null;
      });
  },
});

export const { addToken, logout, validateToken } = authSlice.actions;
export default authSlice.reducer;