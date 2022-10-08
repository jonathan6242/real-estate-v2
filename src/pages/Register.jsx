import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Google from "../components/Google";
import { auth, db } from "../firebase";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    // Validate required
    if(name === '') {
      setErrorMessage('The name field is empty.');
      return;
    } else if(email === '') {
      setErrorMessage('The email field is empty.');
      return;
    } else if (password === '') {
      setErrorMessage('The password field is empty.');
      return;
    }
    // Validate email
    if(!validateEmail(email)) {
      setErrorMessage('Email is invalid.')
      return;
    }
    // Validate password
    if(password.length < 5) {
      setErrorMessage('Password must be at least 5 characters.')
      return;
    } else if(password.length > 19) {
      setErrorMessage('Password must be less than 20 characters.')
      return;
    }
    setErrorMessage('');

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, { displayName: name })
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
      navigate('/');
    } catch (error) {
      if(error.message === 'Firebase: Error (auth/email-already-in-use).') {
        setErrorMessage('Account already exists.')
      } else {
        setErrorMessage(error.message)
      }
      setLoading(false);
    }
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
  }

  return (
    <div className="flex-1 bg-background flex">
      <div className="container mx-auto sm:max-w-lg sm:px-6 sm:py-16">
        {/* Form */}
        <form
          className="bg-white px-6 py-8 sm:p-8 shadow-md rounded text-center h-full sm:h-auto"
          onSubmit={onSubmit}
        >
          <h3 className="text-3xl mb-6">
            Register
          </h3>
          {/* Error */}
          {
            errorMessage && (
              <div className="px-6 py-3 bg-red-200 border border-red-300 text-red-700 rounded mb-6">
                {errorMessage}
              </div>
            )
          }
          {/* Name */}
          <div className="relative rounded border border-lightgray overflow-hidden
          flex items-center mb-2">
            <i className="fa-solid fa-user absolute left-4 text-secondary text-sm
            pointer-events-none"></i>
            <input 
              type="text" 
              className="pl-12 py-3 pr-6 w-full focus:outline-none placeholder-secondary"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Email */}
          <div className="relative rounded border border-lightgray overflow-hidden
          flex items-center mb-2">
            <i className="fa-solid fa-envelope absolute left-4 text-secondary text-sm
            pointer-events-none"></i>
            <input 
              type="text" 
              className="pl-12 py-3 pr-6 w-full focus:outline-none placeholder-secondary"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="relative rounded border border-lightgray overflow-hidden
          flex items-center mb-4">
            <i className="fa-solid fa-lock absolute left-4 text-secondary text-sm
            pointer-events-none"></i>
            <input 
              type={showPassword ? 'text' : 'password'}
              className="px-12 py-3 w-full focus:outline-none placeholder-secondary"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i 
              className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'} absolute right-4 text-secondary cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <button 
            className="px-6 py-3 bg-lightblue text-white font-medium rounded
          hover:bg-[#33beff] duration-200 ease w-full mb-4 h-12"
          >
            {
              loading ? <i className="fa-solid fa-spinner animate-spin"></i>
              : "Sign up"
            }
          </button>
          {/* Google */}
          <Google 
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
          />
          <div className="text-center">
            Already have an account?&nbsp;
            <Link
              to='/signin'
              className="text-lightblue font-medium hover:underline"
            >
              Sign in.
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Register