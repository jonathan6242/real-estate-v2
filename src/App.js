import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Category from "./pages/Category";
import ListingPage from "./pages/ListingPage";
import EditListing from "./pages/EditListing";
import Favourites from "./pages/Favourites";
import Footer from "./components/Footer";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location?.pathname])

  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/profile' element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/createlisting' element={<CreateListing />} />
        <Route path='/category/:category' element={<Category />} />
        <Route path='/listing/:id' element={<ListingPage />} />
        <Route path='/editlisting/:id' element={<EditListing />} />
        <Route path='/favourites' element={<PrivateRoute />} >
          <Route path='/favourites' element={<Favourites />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
