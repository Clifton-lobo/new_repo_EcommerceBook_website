import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const initialState={
    isLoading:false,
    addressList:[]     
}

export const addAddress = createAsyncThunk('/address/addAddress',async(formData)=>{
    const res =await axios.post('http://localhost:5000/api/user/address/add',formData);
    return res.data
})

export const fetchAllAddress = createAsyncThunk('/address/fetchAllAddress',
    async(userId)=>{
    const res =await axios.get(`http://localhost:5000/api/user/address/get/${userId}`);

    return res.data
})

export const editAddress = createAsyncThunk('/address/editAddress',
    async({formData,userId,addressId})=>{
    const res =await axios.put(`http://localhost:5000/api/user/address/update/${userId}/${addressId}`,formData);

    return res.data
})

export const deleteAddress = createAsyncThunk('/address/deleteAddress',
    async({userId,addressId})=>{
    const res =await axios.delete(`http://localhost:5000/api/user/address/delete/${userId}/${addressId}`);

    return res.data
})

const AddressSlice = createSlice({
  name:'address',
  initialState,
  reducers:{},
  extraReducers: (builder)=>{
   builder.addCase(addAddress.pending,(state)=>{
    state.isLoading=true
   }).addCase(addAddress.fulfilled,(state,action)=>{
    state.isLoading=false;
   }).addCase(addAddress.rejected,(state)=>{
    state.isLoading=false;
   }).addCase(editAddress.pending,(state)=>{
    state.isLoading=true;
   }).addCase(editAddress.fulfilled,(state,action)=>{
    state.isLoading=false;
    state.addressList=action.payload.data;
   }).addCase(editAddress.rejected,(state)=>{
    state.isLoading=false;
    state.addressList=[];
   }).addCase(fetchAllAddress.pending,(state)=>{
    state.isLoading=true;
   }).addCase(fetchAllAddress.fulfilled,(state,action)=>{
    state.isLoading=false;
    state.addressList=action.payload.data;
   }).addCase(fetchAllAddress.rejected,(state)=>{
    state.isLoading=false;
    state.addressList=[];
   }).addCase(deleteAddress.pending,(state)=>{
    state.isLoading=true;
   }).addCase(deleteAddress.fulfilled,(state,action)=>{
    state.isLoading=false;
    state.addressList=action.payload.data;
   }).addCase(deleteAddress.rejected,(state)=>{
    state.isLoading=false;
    state.addressList=[];
   })
  }
})

export default AddressSlice.reducer;