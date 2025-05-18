import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './Utils/AuthContext';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    // const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')


    async function handleSubmit(e) {
        e.preventDefault()

          setMessage('')
          setError("")
          // setLoading(true)
          await resetPassword(emailRef.current.value)
            .then(() => {
              setMessage("Check your inbox for instructions")
            })
            .catch(error => {
              setError("Failed to reset password: " + error.code)
            });
          // setLoading(false)
    }


    return (
      <div className="min-h-screen flex items-start justify-center px-4 pt-8 md:pt-16">
        <div className="w-full max-w-md bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">Reset Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              ref={emailRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600 font-medium">{message}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>

          <div className="text-sm text-center mt-4 text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
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
}
