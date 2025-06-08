import {  logoutUser } from '@/store/auth-slice/AuthSlice';
import { AlignJustify,LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';


const AdminHeader = ({setOpen}) => {
  
const dispatch = useDispatch();
  
  function handleLogout(){
    dispatch(logoutUser())
  }
  
  return (
   <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
       <button onClick={()=>setOpen(true)} className='p-4 lg:hidden sm:block'>
        
       <AlignJustify className='bg-[#10172C] w-12 h-8 text-white  rounded'/>
          <span className='sr-only'>toggle menu</span>
       </button> 
       
       <div className='flex justify-end flex-1 '>
          <button onClick={handleLogout} className='inline-flex gap-2 bg-[#10172C] p-2 text-white  rounded'>
            <LogOut />
            Logout
          </button>
       </div>
   </header>
  )
}

export default AdminHeader
