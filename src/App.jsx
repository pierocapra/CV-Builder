import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./Utils/AuthContext";
import Header from './Components/Header';
import CvAssemble from './pages/CvAssemble';
import AddEdit from './pages/AddEdit';
import Test from './pages/Test';
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import HomePage from "./pages/HomePage.jsx";
import ForgotPassword from "./ForgotPassword.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="p-6 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cv-editor" element={<AddEdit />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path="/cv-assemble" element={<CvAssemble />} />
              <Route path="/try" element={<AddEdit mode="try" />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
