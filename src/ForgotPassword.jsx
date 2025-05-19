import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './Utils/AuthContext';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError("")
            setIsLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
        } catch (error) {
            setError(
                error.code === 'auth/user-not-found' 
                    ? "No account found with this email" 
                    : "Failed to reset password. Please try again."
            )
        } finally {
            setIsLoading(false)
        }
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
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Reset Password'
              )}
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
