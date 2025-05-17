import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import {  updateProfile } from "firebase/auth";

import { useAuth } from './Utils/AuthContext';

function Signup() {
    const passwordRef = useRef();
    const passwordConfirmRef = useRef()
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const { signup } = useAuth();

    async function handleSubmit(e) { 
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        setError("")

        await signup(emailRef.current.value, passwordRef.current.value)
          .then((userCredential) => {
              // Signed in 
              updateProfile(userCredential.user, {
                  displayName:  firstNameRef.current.value + " " + lastNameRef.current.value
              })

              // setTimeout is a bit hacky, can think of different solution
              setTimeout(()=>{navigate("/cv-editor")}, 500)    
          })
          .catch((error) => {
            setError("Failed to create an account: " + error.code)
          });


      }

      return (
        <div className="min-h-screen md:py-12 flex items-start md:items-center justify-center px-4">
          <div className="w-full max-w-md bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">Create an Account</h1>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                ref={firstNameRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                ref={lastNameRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="email"
                type="email"
                placeholder="Email"
                ref={emailRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="pass"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="confirmPass"
                type="password"
                placeholder="Confirm Password"
                ref={passwordConfirmRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
  
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
  
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
  
            <div className="text-sm text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      );
}

export default Signup;
