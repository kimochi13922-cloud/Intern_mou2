import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IndexPage from './pages/IndexPage';
import ResearchPage from './pages/ResearchPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/research" element={<ResearchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
