import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SqlProvider, ActivityProvider } from './sql_connect';
import Navbar from './components/Navbar';
import IndexPage from './pages/IndexPage';
import MouPage from './pages/MouPage';
import AddMouPage from './pages/AddMouPage';
import DetailPage from './pages/detailPage';
import LoginPage from './pages/loginPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  
  
  return (
    <SqlProvider>
      <ActivityProvider>
        <Router>
          <div className="bg-gray-50 text-gray-900 antialiased min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/MouPage" element={<ProtectedRoute><MouPage /></ProtectedRoute>} />
              <Route path="/add-Mou" element={<ProtectedRoute><AddMouPage /></ProtectedRoute>} />
              <Route path='/mouInfo' element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
              <Route path='/login' element={<LoginPage/>}/>
            </Routes>
          </div>
        </Router>
      </ActivityProvider>
    </SqlProvider>
  );
}

export default App;
