import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {URL} from '../utils/urlconfig';

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${URL.userUrl}`,{headers:{Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}});
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch a specific user by ID
export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL.userUrl}/${id}/user`);
    console.log('user response', response);
    
    return response.data.data; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete a user by ID
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${URL.userUrl}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL.userUrl}/create`, userData);
    console.log('create user res', response);
    
    return response.data.data;  
  } catch (error) {
    return rejectWithValue(error.response.data); 
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async({id, userData},{rejectWithValue})=>{
  try{
    const response = await axios.put(`${URL.userUrl}/${id}/update`, userData);
    return response.data.data;
  }catch(error){
    return rejectWithValue(error.response.data);
  }
})

export const adminUpdateUser = createAsyncThunk('users/adminUpdateUser', async({id, userData}, {rejectWithValue})=>{
  try{
     const response = await axios.put(`${URL.userUrl}/update/${id}`, userData);
     return response.data.data;
  }catch(error){
    return rejectWithValue(error.response.data);
  }
})

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [], 
    selectedUser: null, 
    loading: false,
    error: null
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); 
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(adminUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(adminUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
