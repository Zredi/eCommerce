import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

// Async Thunk for fetching categories
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.categoryUrl}`);
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.categoryUrl}/category/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for creating a category
export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${URL.categoryUrl}/add`, categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for updating a category
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            
            const response = await axios.put(`${URL.categoryUrl}/category/${id}/update`, categoryData);
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async Thunk for deleting a category
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${URL.categoryUrl}/category/${id}/delete`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Category Slice
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        selectedCategory: null
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Fetch Categories
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });


        builder.addCase(fetchCategoryById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCategory = action.payload;
        });
        builder.addCase(fetchCategoryById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Create Category
        builder.addCase(createCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories.push(action.payload);
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update Category
        builder.addCase(updateCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.categories.findIndex(cat => cat.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        });
        builder.addCase(updateCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete Category
        builder.addCase(deleteCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = state.categories.filter(cat => cat.id !== action.payload);
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;