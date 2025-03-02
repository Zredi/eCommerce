/**
 * The code defines a JavaScript module that handles file uploads and makes API calls using Redux
 * Toolkit.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



function UploadFilesService() {
    const makeApiCall = async (api, formData, options = {}) => {
        const { token, ...otherOptions } = options;
        const res = await fetch(api, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            ...otherOptions,
        });
        return await res.json();
    };

    const upload = (file, onUploadProgress, token) => {
        let formData = new FormData();
        formData.append("file", file);

        return makeApiCall(`${process.env.REACT_APP_IMS_ENDPOINT_URL}/upload`, formData, {
            onUploadProgress,
            token,
        });
    };


    const getFiles = async (fileName, token) => {
        const url = `${process.env.REACT_APP_IMS_ENDPOINT_URL}/download?fileName=${fileName}`;
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            console.error(`Error fetching file: ${response.statusText}`);
            throw new Error(`Error fetching file: ${response.statusText}`);
          }
      
          console.log('File fetched successfully:', response);
          return response;
        } catch (error) {
          console.error("Error fetching file:", error.message);
          throw error;
        }
      };

      const uploadProductImage = (file, onUploadProgress, token) => {
        let formData = new FormData();
        formData.append("file", file);

        return makeApiCall(`${process.env.REACT_APP_IMS_ENDPOINT_URL}/uploadProductImage`, formData, {
            onUploadProgress,
            token,
        });
    };

    const getUploadedProductImage = async (fileName, token) => {
        const url = `${process.env.REACT_APP_IMS_ENDPOINT_URL}/downloadProductImage?fileName=${fileName}`;
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            console.error(`Error fetching file: ${response.statusText}`);
            throw new Error(`Error fetching file: ${response.statusText}`);
          }
      
          console.log('File fetched successfully:', response);
          return response;
        } catch (error) {
          console.error("Error fetching file:", error.message);
          throw error;
        }
      };


    return {
        upload,
        getFiles,
        uploadProductImage,
        getUploadedProductImage
    };
}

export default UploadFilesService;


const initialState = {
    userShoppingBag: undefined,
    loading: false,
    error: '',
    userShoppingBags: []
}

const makeApiCall = async (api, token = "") => {
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },

    })
    return await res.json();
}
const makePostApiCall = async (api, body, token = "") => {
    console.log(api)
    const res = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body)

    })
    return await res.json();
}

export const userShoppingBags = createAsyncThunk(
    'userShoppingBags',
    async ({ token }) => {
        const result = await makeApiCall(`${URL.userShoppingBagUrl}`, token);
        return result;
    }
)

export const userShoppingBagByName = createAsyncThunk(
    'userShoppingBagByName',
    async ({ userShoppingBagName, token }) => {
        const result = await makePostApiCall(`${URL.userShoppingBagUrl}/${userShoppingBagName}`, null, token);
        return result;
    }
)

export const userShoppingBagById = createAsyncThunk(
    'userShoppingBagById',
    async ({ id, token }) => {
        const result = await makeApiCall(`${URL.userShoppingBagUrl}/${id}`, token);
        return result;
    }
)
export const userShoppingBagByUserId = createAsyncThunk(
    'userShoppingBagByUserId',
    async ({ id, token }) => {
        const result = await makeApiCall(`${URL.userShoppingBagUrl}/byUserId/${id}`, token);
        return result;
    }
)

export const userShoppingBagToSaveApi = createAsyncThunk(
    'userShoppingBagToSave',
    async ({ userShoppingBag, token }) => {
        const result = await makePostApiCall(`${URL.userShoppingBagUrl}`, userShoppingBag, token);
        return result;
    }
)

export const userShoppingBagSlice = createSlice({
    name: "userShoppingBag",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(userShoppingBagByUserId.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBags = action.payload;
                }
            })
            .addCase(userShoppingBagToSaveApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBag = action.payload;
                }
            })
            .addCase(userShoppingBagById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userShoppingBag = action.payload;
                } else {
                    state.userShoppingBag = undefined;
                }
            })
            .addCase(userShoppingBagByName.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userShoppingBag = undefined;
                } else if (action.payload.id) {
                    state.userShoppingBag = action.payload;
                    state.error = '';
                }
            })
            .addCase(userShoppingBags.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message) {
                    state.error = action.payload.message;
                    state.userShoppingBags = undefined;
                } else if (action.payload) {
                    state.userShoppingBags = action.payload;
                    state.error = '';
                }
            })
            .addCase(userShoppingBags.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.userShoppingBag = undefined;
            });
    }
    
});