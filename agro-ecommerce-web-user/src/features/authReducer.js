

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from '../utils/urlconfig';
import { isTokenExpired } from "../utils/jwtUtils";


const initialState = {
  authData: null, 
  loading: false,
  error: null,   
};

const makeApiCall = async (api, values, token = "") => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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