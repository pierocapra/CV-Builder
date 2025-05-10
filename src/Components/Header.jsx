import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [error, setError] = useState(null);
  const { logout } = useAuth()
  const navigate = useNavigate();
    
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

  function handleSignup() {
    navigate("/signup")
}

  const {currentUser}  = useAuth();

  function getInitials(name) {
    const nameArray = name.split(' '); // Split the name into an array of words
    const initials = nameArray.map(word => word.charAt(0).toUpperCase()); // Get the first character of each word and capitalize it
    return initials.join(''); // Join the initials into a single string
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">CV Builder</h1>
      <div className="space-x-4">
        {currentUser ? (
          <>
            <span> Hello {currentUser.displayName}!</span>
            {window.location.pathname === "/cv-editor" ? (
              <Link to="/cv-assemble" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                CV Assemble
              </Link>
            ) : (
              <Link to="/cv-editor" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
                CV Editor
              </Link>
            )}
            <button onClick={handleLogout}>SignOut</button>
          </>
        ) : (
          <>
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
