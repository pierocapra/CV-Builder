import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/CvContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [error, setError] = useState(null);
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

//   function handleSignup() {
//     navigate("/signup")
// }

  // function getInitials(name) {
  //   const nameArray = name.split(' '); // Split the name into an array of words
  //   const initials = nameArray.map(word => word.charAt(0).toUpperCase()); // Get the first character of each word and capitalize it
  //   return initials.join(''); // Join the initials into a single string
  // }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">CV Builder</h1>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Hello {user.email}!</span>
            {isEditorPage && (
              <button
                onClick={() => setAssemble(prev => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {assemble ? 'CV Editor' : 'CV Assemble'}
              </button>
            )}
            {!isEditorPage && (
              <Link to="/cv-editor" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
                CV Editor
              </Link>
            )}
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </>
        ) : (
          <>
            {isEditorPage && (
              <button
                onClick={() => setAssemble(prev => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {assemble ? 'CV Editor' : 'CV Assemble'}
              </button>
            )}
            {!isEditorPage && (
              <Link to="/try" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Try It Out
              </Link>
            )}
            <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Login
            </Link>
            <Link to="/signup" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
