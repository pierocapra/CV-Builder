import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { assemble, setAssemble } = useCv();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditorPage = location.pathname === '/cv-editor' || location.pathname === '/try';
    
  async function handleLogout() {
    setError("")
    try {
      await logout()
      navigate("/")
    } catch {
      setError("Failed to log out")
      console.log(error);
    }
  }

  const MenuItems = () => (
    <>
      {user ? (
        <>
          <span className="block md:inline">Hello {user.email}!</span>
          {isEditorPage && (
            <button
              onClick={() => setAssemble(prev => !prev)}
              className="w-full md:w-auto mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {assemble ? 'CV Editor' : 'CV Assemble'}
            </button>
          )}
          {!isEditorPage && (
            <Link to="/cv-editor" className="block md:inline-block w-full md:w-auto mt-2 md:mt-0 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded text-center">
              CV Editor
            </Link>
          )}
          <button onClick={handleLogout} className="w-full md:w-auto mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </>
      ) : (
        <>
          {isEditorPage && (
            <button
              onClick={() => setAssemble(prev => !prev)}
              className="w-full md:w-auto mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {assemble ? 'CV Editor' : 'CV Assemble'}
            </button>
          )}
          {!isEditorPage && (
            <Link to="/try" className="block md:inline-block w-full md:w-auto mt-2 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center">
              Try It Out
            </Link>
          )}
          <Link to="/login" className="block md:inline-block w-full md:w-auto mt-2 md:mt-0 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-center">
            Login
          </Link>
          <Link to="/signup" className="block md:inline-block w-full md:w-auto mt-2 md:mt-0 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-center">
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            📄 CV Builder
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <MenuItems />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
