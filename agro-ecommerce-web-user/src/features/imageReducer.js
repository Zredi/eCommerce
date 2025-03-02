import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../utils/urlconfig';

// Async Thunks
export const uploadImages = createAsyncThunk(
  'images/uploadImages',
  async ({ files, productId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      files.forEach(file => formData.append('files', file));

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(`${URL.imageUrl}/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
      return response.data.data;
    } catch (error) {
        console.error('Upload error:', error.response || error);
        return rejectWithValue(error.response?.data || 'Upload failed');
    }
  }
);

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({ imageId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(
        `${URL.imageUrl}/image/${imageId}/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await axios.delete(`${URL.imageUrl}/image/${imageId}/delete`);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadImage = createAsyncThunk(
  'images/downloadImage',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${URL.imageUrl}/image/download/${imageId}`,
        {
          responseType: 'blob',
        }
      );
      return {
        id: imageId,
        blob: response.data,
        fileName: response.headers['content-disposition']
          .split('filename=')[1]
          .replace(/"/g, ''),
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Image Slice
const imageSlice = createSlice({
  name: 'image',
  initialState: {
    images: [],
    loading: false,
    error: null,
    selectedImage: null,
    downloadedImage: null,
  },
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    resetImages: (state) => {
      state.images = [];
      state.error = null;
      state.selectedImage = null;
      state.downloadedImage = null;
    },
    clearDownloadedImage: (state) => {
      state.downloadedImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Images
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...state.images, ...action.payload];
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Image
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Image
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download Image
      .addCase(downloadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.downloadedImage = action.payload;
      })
      .addCase(downloadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedImage, resetImages, clearDownloadedImage } =
  imageSlice.actions;
export default imageSlice.reducer;