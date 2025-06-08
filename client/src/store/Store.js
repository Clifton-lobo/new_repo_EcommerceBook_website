import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth-slice/AuthSlice'
import AdminProductSlice from './admin/productSlice/productSlice'
import ProductSlice from './user/productSlice/UserProductSlice';
import shoppingCartSlice from './user/cartSlice/CartSlice';
import shopAddressSlice from './user/AddressSlice' 
import shopOrderSlice from './user/OrderSlice/OrderSlice'
import shopSearchSlice from './user/SearchSlice/searchSlice'
import adminOrderSlice from './admin/adminOrderSlice'

const store =configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:AdminProductSlice,
        adminOrder:adminOrderSlice,
        UserProductSlice:ProductSlice,
        shopCart:shoppingCartSlice,
        shopAddress : shopAddressSlice,
        userOrder :shopOrderSlice,
        shopSearch:shopSearchSlice,
    },
});


export default store;