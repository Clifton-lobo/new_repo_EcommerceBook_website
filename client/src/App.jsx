import { Routes,Route } from 'react-router-dom'
import './App.css'
import Layout from './components/auth/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLayout from './components/admin-view/AdminLayout'
import Dashboard from './pages/adminViewPages/Dashboard'
import Products from './pages/adminViewPages/Products'
import Orders from './pages/adminViewPages/adminViewOrders'
import Features from './pages/adminViewPages/Features'
import UserLayout from './components/User-view/UserLayout'
import NotFound from './pages/Not-found/NotFound'
import UserHome from './pages/UserViewPages/UserHome'
import Checkout from './pages/UserViewPages/Checkout'
import Account from './pages/UserViewPages/Account'
import UserProduct from './pages/UserViewPages/UserProduct'
import CheckAuth from './components/common/CheckAuth'
import UnAuth from './pages/Un-Auth/UnAuth'
import { useDispatch, useSelector } from 'react-redux'
import { checkauth } from './store/auth-slice/AuthSlice'
import { useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturn from './pages/UserViewPages/PaypalReturn'
import Search from './pages/UserViewPages/Search'
import PaymentSuccess from './pages/UserViewPages/PaymentSuccess'

// import Form from './components/common/Form'

function App() {

  const {user,isAuthenticated,isLoading}= useSelector((state)=>state.auth);
  const dispatch =useDispatch();

   useEffect(()=>{
    dispatch(checkauth());
  },[dispatch]);

  if(isLoading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />

  
  return (
    <div className='flex flex-col overflow-hidden bg-white '>
     
      <Routes>
      <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Layout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={< Register />} />
        </Route>
      
          <Route path='/admin' element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout/>
            </CheckAuth>
          }>  
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path='products' element={<Products/>} />
            <Route path='Orders' element={<Orders/>} />
            <Route path='Features' element={<Features/>} />  
          </Route>  
          
          <Route path='user' element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout/> 
            </CheckAuth>
          }>
              <Route path='home' element={<UserHome/>}/>
              <Route path='checkout' element={<Checkout/>}/>
              <Route path='account' element={<Account/>}/>
              <Route path='products' element={<UserProduct/>}/>
              <Route path='success' element={<PaymentSuccess/>}/>
              <Route path='search' element={<Search/>}/>
          </Route> 
          
          <Route path='*' element={<NotFound/>}></Route>        
          <Route path='/UnAuth' element={<UnAuth/>}></Route> 

      </Routes>     
    </div>
  )
}

export default App