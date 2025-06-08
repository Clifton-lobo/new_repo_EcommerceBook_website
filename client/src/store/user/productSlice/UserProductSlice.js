import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState ={
    isLoading:false,
    productList:[],
    productDetails:null,
}

export const fetchAllListedProduct = createAsyncThunk('/products/fetchAllListedProduct',
    async ({filterParams,sortParams}) => {

        const query= new URLSearchParams({
            ...filterParams
            ,sortBy : sortParams});   

        const result = await axios.get(`http://localhost:5000/api/user/products/get?${query}`);
        return result?.data;
    }
);
 
export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails',
    async (id) => {
        const result = await axios.get(`http://localhost:5000/api/user/products/get/${id}`);
        return result?.data;
    }
);
const productSlice = createSlice({
    name: 'userProduct',
    initialState,
    reducers:{
        resetproductDetails: (state) => {
            state.productDetails = null;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllListedProduct.pending,(state,action)=>{
            state.isLoading = true; 
        }).addCase(fetchAllListedProduct.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.productList = action.payload.message || action.payload.data;
            //  state.productList=action.payload.message; 
            // state.productList=action.payload.data;
        }).addCase(fetchAllListedProduct.rejected,(state,action)=>{
            state.isLoading = false;
         state.productList=[]; 
        }).addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.productDetails = action.payload.message || action.payload.data;
            // state.productList=action.payload.data;
            //  state.productList=action.payload.message; 
        }).addCase(fetchProductDetails.pending,(state,action)=>{
            state.isLoading = true; 
        }).addCase(fetchProductDetails.rejected,(state,action)=>{
            state.isLoading = false;
         state.productDetails=null; 
        })
            
    }
})

export default productSlice.reducer;