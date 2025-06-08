import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  isLoading: false,
  error: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/order/getOrders?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/order/details/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/order/update/${id}`,
        { orderStatus }
      );
      
      // Get current pagination state
      const { pagination } = getState().adminOrder;
      
      // Refresh the order list after update with current pagination
      const ordersResponse = await axios.get(
        `http://localhost:5000/api/admin/order/getOrders?page=${pagination.currentPage}&limit=50`
      );
      
      return {
        updatedOrder: response.data.order,
        orders: ordersResponse.data.orders,
        pagination: ordersResponse.data.pagination
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to update order status" });
    }
  }
);

// Add debug function to check orders
export const debugOrders = createAsyncThunk(
  "order/debugOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/order/debug");
      console.log("Debug response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Debug error:", error);
      return rejectWithValue(error.response?.data || { message: "Debug failed" });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.orders || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.error = null;
        console.log(`Loaded ${state.orderList.length} orders for admin`);
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload?.message || "Failed to fetch orders";
        console.error("Failed to fetch orders:", action.payload);
      })
      
      // Get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload?.message || "Failed to fetch order details";
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.updatedOrder;
        state.orderList = action.payload.orders || state.orderList;
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update order status";
      })
      
      // Debug orders
      .addCase(debugOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(debugOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Debug info:", action.payload);
      })
      .addCase(debugOrders.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Debug failed:", action.payload);
      });
  },
});

export const { resetOrderDetails, clearError, setCurrentPage } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;