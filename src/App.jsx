import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import CvBuilder from './pages/CvBuilder';
import AddEdit from './pages/AddEdit';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-6 max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<AddEdit />} />
            <Route path="/cv-builder" element={<CvBuilder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
