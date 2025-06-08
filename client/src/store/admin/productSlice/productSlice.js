import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    productList: [],
};

// Async thunk to add a new product
export const addNewProduct = createAsyncThunk('/products/addnewproduct',
    async (formData) => {
        const result = await axios.post('http://localhost:5000/api/admin/products/add', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return result?.data;
    }
);

// Async thunk to fetch all products
export const fetchAllProduct = createAsyncThunk('/products/fetchAllProduct',
    async () => {
        const result = await axios.get('http://localhost:5000/api/admin/products/get');
        return result?.data;

    
    }
);

// Async thunk to edit a product
export const editProduct = createAsyncThunk('/products/editProduct',
    async ({ id, formData }) => {
        const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return result?.data;
    }
);  

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk('/products/deleteProduct',
    async (id) => {
        const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
        return result?.data;
    }
);

// Product Slice
const AdminProductSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProduct.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllProduct.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            });
    }
});

export default AdminProductSlice.reducer;
