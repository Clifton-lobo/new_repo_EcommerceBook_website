import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    orderId: null,
    razorpayOrderId: null,
    razorpayAmount: null,
    orderList:[],
    orderDetails:null
};

export const createRazorpayOrder = createAsyncThunk(
  "order/createRazorpayOrder",
  async ({ totalAmount, cartItems, addressInfo, userId }, { rejectWithValue }) => {
    try {
        // // Validate minimum amount
        // if (totalAmount < 1) { // At least 1 INR (100 paise)
        //   throw new Error('Amount must be at least ₹1');
        // }

      const res = await axios.post("http://localhost:5000/api/user/order/create", {
        totalAmount,   // Convert to paise
        cartItems,
        addressInfo,
        userId
      });

      if (!res.data.razorpayOrderId) {
        throw new Error('Razorpay order ID not received');
      }

      return res.data;
    } catch (error) {
      console.error('Order creation error:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      });
    }
  }
);
  
// OrderSlice.js
export const confirmFinalOrder = createAsyncThunk(
  "order/confirmFinalOrder",
  async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/order/verify", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        userId
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Payment verification failed");
      }

      return res.data;
    } catch (error) {
      console.error("Verification Error:", {
        message: error.message,
        response: error.response?.data
      });
      return rejectWithValue(error.response?.data || { 
        message: error.message 
      });
    }
  }
);

  export const getAllOrdersByUserId = createAsyncThunk(
    "order/getAllOrdersByUserId",
    async (userId) => {
      const response = await axios.get(
        `http://localhost:5000/api/user/order/list/${userId}`
      );
  
      return response.data;
    }
  );
  
  export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id) => {
      const response = await axios.get(
        `http://localhost:5000/api/user/order/details/${id}`
      );
  
      return response.data;
    }
  );
  

const shoppingOrderSlice = createSlice({
    name: "shoppingOrder",
    initialState,
    reducers: {
      resetOrderDetails: (state) => {
        state.orderDetails = null;
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRazorpayOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRazorpayOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.razorpayOrderId = action.payload.razorpayOrderId; // ✅ correct key
                state.razorpayAmount = action.payload.orderAmount;
                state.orderId = action.payload.internalOrderId; 
            }).addCase(createRazorpayOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.orderId = null;
            state.error = action.payload?.message || "Order creation failed";
            console.error("Order creation failed:", action.payload);
      
                console.error("Order creation failed:", action.payload);
            }).addCase(confirmFinalOrder.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(confirmFinalOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action.payload.order._id; // ✅ correct
              })
              .addCase(confirmFinalOrder.rejected, (state) => {
                state.isLoading = false;
                state.orderId = null;
              }) .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.orders;
              })
              .addCase(getAllOrdersByUserId.rejected,(state) => {
                state.isLoading = false;
                state.orderList = [];
              })
              .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
              })
              .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
              });
    }
});

export default shoppingOrderSlice.reducer;
export const {resetOrderDetails}=shoppingOrderSlice.actions;