import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">My CV App</h1>
      <div className="space-x-4">
        <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
          Login
        </Link>
        <Link to="/" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
          CV Editor
        </Link>
        <Link to="/cv-builder" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          CV Builder
        </Link>
      </div>
    </header>
  );
};

export default Header;
