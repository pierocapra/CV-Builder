import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from './Utils/AuthContext';

const LoginPage = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        await login(emailRef.current.value, passwordRef.current.value)
          .then(() => {
            // Signed in 
            navigate("/cv-editor")
          })
          .catch((error) => {
            setError("Failed to log in: " + error.code)
          });
      }

  return (
    <div className="min-h-screen md:py-12 flex items-start md:items-center justify-center px-4">
        <div className="w-full max-w-md bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">Login to CV Builder</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              ref={emailRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="pass"
              type="password"
              placeholder="Enter your password"
              ref={passwordRef}
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
              Log In
            </button>
          </form>

          <div className="text-sm text-center mt-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="text-sm text-center mt-2 text-gray-600">
            Need an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link to="/try" className="inline-block text-blue-700 hover:text-blue-900 font-medium">
              <h3 className="text-lg underline">Try the app without signing in</h3>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
