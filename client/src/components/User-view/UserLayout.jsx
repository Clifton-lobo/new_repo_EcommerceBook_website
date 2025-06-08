import { Outlet } from "react-router-dom"
import UserHeader from "./UserHeader"

const UserLayout = () => {
  return (
    <div className="flex flex-col overflow-hidden bg-white ">
      <UserHeader/> {/* common header */}
      <main className="flex flex-col w-full "> 
        <Outlet/>
      </main>
    </div>
  )
}

export default UserLayout
