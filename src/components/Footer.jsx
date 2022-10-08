import { Link } from "react-router-dom"

function Footer() {
  return (
    <>
      <div className="bg-blue py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-white flex flex-wrap gap-y-12">
          {/* Column 1 */}
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 px-4">
            <h2 className="mb-6 text-lg">Discover</h2>
            <div className="flex flex-col items-start space-y-3 font-medium text-sm">
              <Link 
                to='/category/apartment' 
                className="flex space-x-2 hover:text-lightblue duration-200 ease"
              >
                <div className="breadcrumb">&gt;</div>
                <div>Apartment</div>
              </Link>
              <Link 
                to='/category/house' 
                className="flex space-x-2 hover:text-lightblue duration-200 ease"
              >
                <div className="breadcrumb">&gt;</div>
                <div>House</div>
              </Link>
              <Link 
                to='/category/villa' 
                className="flex space-x-2 hover:text-lightblue duration-200 ease"
              >
                <div className="breadcrumb">&gt;</div>
                <div>Villa</div>
              </Link>
              <Link 
                to='/category/rural' 
                className="flex space-x-2 hover:text-lightblue duration-200 ease"
              >
                <div className="breadcrumb">&gt;</div>
                <div>Rural</div>
              </Link>
            </div>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 px-4">
            <h2 className="mb-6 text-lg">Contact Us</h2>
            <div className="flex flex-col items-start space-y-3 font-light text-sm">
              <div 
                className="flex items-center space-x-2"
              >
                <i className="fa-solid fa-location-dot"></i>
                <div>6 John St, Lidcombe NSW</div>
              </div>
              <div 
                className="flex items-center space-x-2"
              >
                <i className="fa-solid fa-phone"></i>
                <div>987 654 9875</div>
              </div>
              <div 
                className="flex items-center space-x-2"
              >
                <i className="fa-solid fa-fax"></i>
                <div>879 456 1349</div>
              </div>
              <div 
                className="flex items-center space-x-2"
              >
                <i className="fa-solid fa-envelope"></i>
                <div>email@homez.com</div>
              </div>
            </div>
          </div>
          {/* Newsletter */}
          <div className="flex flex-col w-full lg:w-1/2 px-4">
            <h2 className="mb-6 text-lg">Newsletter</h2>
            <div className="flex flex-col sm:flex-row text-sm gap-x-4 gap-y-2">
              <input 
                type="text"
                className="w-full sm:w-2/3 px-4 py-3 rounded outline-none text-black"
                placeholder="Enter your email"
              ></input>
              <button 
                className="w-full sm:w-1/3 px-4 py-3 bg-lightblue text-center font-medium rounded hover:bg-opacity-75 duration-200 ease cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-darkblue py-8 flex flex-col">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-white">
          {/* Socials */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Facebook */}
            <button className="flex items-center space-x-3 h-6 hover:text-[#48629a]">
              <i className="fa-brands fa-facebook-f leading-6"></i>
              <span className="font-light text-sm self-end">Facebook</span>
            </button>
            {/* Twitter */}
            <button className="flex items-center space-x-3 h-6 hover:text-[#0099d4]">
              <i className="fa-brands fa-twitter leading-6"></i>
              <span className="font-light text-sm self-end">Twitter</span>
            </button>
            {/* LinkedIn */}
            <button className="flex items-center space-x-3 h-6 hover:text-[#006a9d]">
              <i className="fa-brands fa-linkedin-in leading-6"></i>
              <span className="font-light text-sm self-end">Linkedin</span>
            </button>
            {/* Pinterest */}
            <button className="flex items-center space-x-3 h-6 hover:text-[#fe7276]">
              <i className="fa-brands fa-pinterest-p leading-6"></i>
              <span className="font-light text-sm self-end">Pinterest</span>
            </button>
            {/* YouTube */}
            <button className="flex items-center space-x-3 h-6 hover:text-[#fe5157]">
              <i className="fa-brands fa-youtube leading-6"></i>
              <span className="font-light text-sm self-end">Youtube</span>
            </button>
          </div>
          {/* Logo */}
          <div className="my-9 flex justify-center">
            <button
              className="flex items-start space-x-1 logo"
              onClick={() => window.scrollTo(0, 0)}
            >
              <i className="fa-solid fa-location-dot text-2xl"></i>
              <span className="font-medium text-3xl">homez</span>
            </button>
          </div>
          {/* Copyright */}
          <div className="text-center font-light text-sm">
            &copy; Homez - All rights reserved
          </div>
        </div>
      </footer>
    </>
  )
}
export default Footer