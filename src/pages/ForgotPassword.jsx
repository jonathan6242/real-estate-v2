import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;

    // Validate required
    if(email === '') {
      setErrorMessage('The email field is empty.');
      return;
    }
    // Validate email
    if(!validateEmail(email)) {
      setErrorMessage('Email is invalid.')
      return;
    }
    setErrorMessage('');
  
    try {
      setLoading(true);
      setEmailSent(false);
      await sendPasswordResetEmail(auth, email)
      setEmailSent(true);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Could not send password reset email.')
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
          className="bg-white px-6 py-8 sm:p-8 shadow-md rounded text-center h-full sm:h-auto flex flex-col"
          onSubmit={onSubmit}
        >
          <h3 className="text-3xl mb-4">
            Reset Password
          </h3>
          <p className="text-secondary mb-6">
            Enter your email and we'll send you a code you can use to update your password. 
          </p>
          {/* Error */}
          {
            !emailSent && errorMessage && (
              <div className="px-6 py-3 bg-red-200 border border-red-300 text-red-700 rounded mb-6">
                {errorMessage}
              </div>
            )
          }
          {/* Success */}
          {
            emailSent && (
              <div className="px-6 py-3 bg-green-200 border border-green-300 text-green-700 rounded mb-6">
                Email was sent!
              </div>
            )
          }
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
          <button 
            className="px-6 py-3 bg-lightblue text-white font-medium rounded
          hover:bg-[#33beff] duration-200 ease w-full mb-4"
          >
            {
              loading ? <i className="fa-solid fa-spinner animate-spin"></i>
              : "Reset password"
            }
          </button>
          <div className="text-center">
            Go back to&nbsp;
            <Link
              to='/signin'
              className="text-lightblue font-medium hover:underline"
            >
              sign in.
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ForgotPassword