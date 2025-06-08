import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"
import { useState } from "react"

const AdminLayout = () => {

  const [openSideBar,setOpenSideBar]=useState(false);
  
  return (
    
    <div className="flex w-full min-h-screen">
         <AdminSidebar open={openSideBar} setOpen={setOpenSideBar}/>  {/* AdminSidebar */}
         
       <div className="flex flex-col flex-1" >  
         <AdminHeader setOpen={setOpenSideBar}/>    {/* Admin header */}
         
        <main className="flex flex-col flex-1 p-4 bg-muted/40 md:p-6">
            <Outlet/>
        </main>
        
      </div>
    </div>
  )
}

export default AdminLayout
