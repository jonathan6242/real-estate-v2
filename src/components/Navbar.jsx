import { useState } from "react"
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import SidebarOne from "./SidebarOne";
import SidebarTwo from "./SidebarTwo";

function Navbar() {
  const [sidebarOneOpen, setSidebarOneOpen] = useState(false);
  const [sidebarTwoOpen, setSidebarTwoOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuthUser();
  
  return (
    <nav className="bg-blue text-white">
      <div className="container mx-auto max-w-6xl px-2 md:px-6 h-[60px]
      flex items-center">
        {/* Hamburger Menu - Below 768px */}
        <div 
          className="self-stretch flex items-center px-4 mr-auto md:hidden cursor-pointer"
          onClick={() => setSidebarOneOpen(true)}
        >
          <i className="fa-solid fa-bars text-xl md:hidden"></i>
        </div>
        {/* Navbar Logo */}
        <Link to='/' className="flex items-start space-x-1 logo">
          <i className="fa-solid fa-location-dot text-2xl"></i>
          <span className="font-medium text-3xl">homez</span>
        </Link>
        {/* Navbar Links */}
        <div className="self-stretch ml-auto hidden md:flex text-xs uppercase font-medium">
          <Link
            to='/category/sale'
            className="px-4 leading-[60px] cursor-pointer hover:bg-[#00aeff1a] 
            hover:text-lightblue duration-200 ease"
          >
            For Sale
          </Link>
          <Link
            to='/category/rent'
            className="px-4 leading-[60px] cursor-pointer hover:bg-[#00aeff1a] 
            hover:text-lightblue duration-200 ease"
          >
            For Rent
          </Link>
          <div className="px-4 flex items-center">
            <div className="space-x-2 cursor-pointer hover:text-lightblue duration-200 ease">
              <i className="fa-solid fa-phone-volume -rotate-45 -translate-y-[1px]"></i>
              <span>02 9876 5432</span>
            </div>
          </div>
          {
            user ? (
              <>
                <Link
                  to='/profile'
                  className="px-2 flex items-center hover:text-lightblue duration-200 ease cursor-pointer"
                >
                  <i className="fa-regular fa-user-circle text-xl"></i>
                </Link>
                <Link
                  to="/createlisting"
                  className="self-center ml-4 px-6 py-3 bg-lightblue rounded cursor-pointer hover:bg-opacity-75 duration-200 ease"
                >
                  Create Listing
                </Link>
              </>
            ) : (
              <>
              <Link
                to='/signin'
                className="px-2 flex items-center hover:text-lightblue duration-200 ease cursor-pointer"
              >
                <i className="fa-regular fa-user-circle text-xl"></i>
              </Link>
              {
                !location.pathname.includes('signin') ? (
                  <Link
                    to="/signin"
                    className="self-center ml-4 px-6 py-3 bg-lightblue rounded cursor-pointer hover:bg-opacity-75 duration-200 ease"
                  >
                    Sign in
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="self-center ml-4 px-6 py-3 bg-lightblue rounded cursor-pointer hover:bg-opacity-75 duration-200 ease"
                  >
                    Register
                  </Link>
                )
              }
              </>
            )
          }
        </div>
        {/* Profile Icon - Below 768px */}
        <div 
          className="self-stretch flex items-center px-4 ml-auto md:hidden cursor-pointer"
          onClick={() => setSidebarTwoOpen(true)}
        >
          <i className="fa-regular fa-user-circle text-xl"></i>
        </div>
      </div>
      {/* Sidebar One */}
      <SidebarOne 
        open={sidebarOneOpen}
        setOpen={setSidebarOneOpen}
      />
      {/* Sidebar Two */}
      <SidebarTwo 
        open={sidebarTwoOpen}
        setOpen={setSidebarTwoOpen}
      />
    </nav>
  )
}
export default Navbar