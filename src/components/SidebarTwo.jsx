import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { auth } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";

function SidebarTwo({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuthUser();

  return (
    <div className="md:hidden">
      <div 
        className={`fixed inset-0 bg-black/50 z-30 duration-200 ease
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>
      <div className={`fixed right-0 inset-y-0 bg-white text-black z-30 w-60
      ${open ? 'block' : 'hidden'}`}>
        <div className="flex flex-col text-sm uppercase font-medium divide-y border-y">
          {
            user ? (
              <>
                <div 
                  className="p-2"
                >
                  <button 
                    className="px-6 py-3 bg-lightblue rounded cursor-pointer hover:bg-opacity-75 duration-200 ease uppercase text-white w-full"
                    onClick={() => {
                      setOpen(false);
                      navigate('/createlisting')
                    }}
                  >
                    Create listing
                  </button>
                </div>
                <div 
                  className="px-6 py-5 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate('/profile')
                  }}
                >
                  My Profile
                </div>
                <div 
                  className="px-6 py-5 cursor-pointer"
                  onClick={async () => {
                    setOpen(false);
                    await signOut(auth)
                    toast.success('Successfully signed out.', { theme: 'colored' })
                    navigate('/signin')
                  }}
                >
                  Sign out
                </div>
              </>
            ) : (
              !location.pathname.includes('signin') ? (
                <div 
                  className="px-6 py-5 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate('/signin')
                  }}
                >
                  Sign in
                </div>
              ) : (
                <div 
                  className="px-6 py-5 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate('/register')
                  }}
                >
                  Register
                </div>
              )
            )
          }
        </div>
      </div>

    </div>
  )
}
export default SidebarTwo