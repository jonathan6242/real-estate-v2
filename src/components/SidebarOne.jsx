import { useNavigate } from "react-router-dom";

function SidebarOne({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <div className="md:hidden">
      <div 
        className={`fixed inset-0 bg-black/50 z-30 duration-200 ease
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>
      <div className={`fixed left-0 inset-y-0 bg-white text-black z-30 duration-200 ease w-60
      ${open ? 'translate-x-0' : '-translate-x-[200%]'}`}>
        <div className="flex flex-col text-sm uppercase font-medium divide-y border-y">
          <div
            onClick={() => {
              navigate('/category/sale')
              setOpen(false);
            }}
            className="px-6 py-5 cursor-pointer"
          >
            For sale
          </div>
          <div
            onClick={() => {
              navigate('/category/rent')
              setOpen(false);
            }}
            className="px-6 py-5 cursor-pointer"
          >
            For rent
          </div>
        </div>
      </div>

    </div>
  )
}
export default SidebarOne