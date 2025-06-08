import axios from "axios";
import { createSlice, createAsyncThunk } from  "@reduxjs/toolkit";

const initialState ={
 cartItems:[],
 isLoading:false
}

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity, userId }) => {
      const response = await axios.post('http://localhost:5000/api/user/cart/add', {
        userId,
        productId,
        quantity, 
      });
      return response.data;
    }
  );
  
  
export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (userId ) => {
      const response = await axios.get(`http://localhost:5000/api/user/cart/get/${userId}`);
      return response.data;
    }
  );    
  
export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async ({ productId,  userId }) => {
      const response = await axios.delete(`http://localhost:5000/api/user/cart/${userId}/${productId}`, {
        userId,
        productId,
      });
      return response.data;
    }
  );
  
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity, userId }) => {
      const response = await axios.put('http://localhost:5000/api/user/cart/update-cart', {
        userId,
        productId,
        quantity,
      });
      return response.data;
    }
  );
  

  const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(addToCart.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload.data; // ✅ Remove `.data`
        })
        .addCase(addToCart.rejected, (state) => {
          state.isLoading = false;
          state.cartItems = [];
        })
        .addCase(fetchCartItems.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload.data; // ✅ Remove `.data`
        })
        .addCase(fetchCartItems.rejected, (state) => {
          state.isLoading = false;
          state.cartItems = [];
        })
        .addCase(deleteCartItem.pending,(state) => {
          state.isLoading = true;
        })
        .addCase(deleteCartItem.fulfilled,(state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload.data; // ✅ Remove `.data`
        })
        .addCase(deleteCartItem.rejected,(state) => {
          state.isLoading = false;
          state.cartItems = []; 
        })
        .addCase(updateCartItem.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateCartItem.fulfilled, (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload.data; // ✅ Remove `.data`
        })
        .addCase(updateCartItem.rejected, (state) => {
          state.isLoading = false;
          state.cartItems = [];
        });
    },
  });
  

export default shoppingCartSlice.reducer;