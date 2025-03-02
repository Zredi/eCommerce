import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

// Async Thunk for fetching categories
export const fetchSubCategories = createAsyncThunk(
    'subCategories/fetchSubCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.subCategoryUrl}`);
            console.log("subcategories", response);
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchSubCategoryById = createAsyncThunk(
    'subCategories/fetchSubCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.subCategoryUrl}/subcategory/${id}`);
            console.log("subcategory", response);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchSubcategoriesByCategory = createAsyncThunk(
    'subCategories/fetchSubcategoriesByCategory',
    async (categoryName, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${URL.subCategoryUrl}/category/${categoryName}/subcategories`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for creating a category
export const createSubCategory = createAsyncThunk(
    'subCategories/createSubCategory',
    async ({categoryId, subCategoryData}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${URL.subCategoryUrl}/category/${categoryId}/subcategories/add`, subCategoryData);
            console.log('response', response);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for updating a category
export const updateSubCategory = createAsyncThunk(
    'subCategories/updateSubCategory',
    async ({ categoryId, subCategoryId, subCategoryData }, { rejectWithValue }) => {
        try {
            
            const response = await axios.put(`${URL.subCategoryUrl}/category/${categoryId}/subcategories/${subCategoryId}/update`, subCategoryData);
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async Thunk for deleting a category
export const deleteSubCategory = createAsyncThunk(
    'subCategories/deleteSubCategory',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${URL.subCategoryUrl}/subcategories/${id}/delete`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Category Slice
const subCategorySlice = createSlice({
    name: 'subCategory',
    initialState: {
        subCategories: [],
        loading: false,
        error: null,
        selectedSubCategory: null
    },
    reducers: {
        setSelectedSubCategory: (state, action) => {
            state.selectedSubCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Fetch SubCategories
        builder.addCase(fetchSubCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSubCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.subCategories = action.payload;
        });
        builder.addCase(fetchSubCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(fetchSubCategoryById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSubCategoryById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedSubCategory = action.payload;
        });
        builder.addCase(fetchSubCategoryById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        builder.addCase(fetchSubcategoriesByCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSubcategoriesByCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.subCategories = action.payload;
        });
        builder.addCase(fetchSubcategoriesByCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Create Category
        builder.addCase(createSubCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createSubCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.subCategories.push(action.payload);
        });
        builder.addCase(createSubCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update Category
        builder.addCase(updateSubCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateSubCategory.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.subCategories.findIndex(cat => cat.id === action.payload.id);
            if (index !== -1) {
                state.subCategories[index] = action.payload;
            }
        });
        builder.addCase(updateSubCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete Category
        builder.addCase(deleteSubCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteSubCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.subCategories = state.subCategories.filter(cat => cat.id !== action.payload);
        });
        builder.addCase(deleteSubCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { setSelectedSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;