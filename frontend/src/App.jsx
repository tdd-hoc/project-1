// src/App.jsx
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Route,  Routes } from 'react-router-dom';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';

export default function App() {
  return (
    <BrowserRouter>
      
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path='/Rooms'
          element={
            <ProtectedRoute>
              <Rooms/>
            </ProtectedRoute>
          }
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />
        </Routes>

    </BrowserRouter>
  );
}