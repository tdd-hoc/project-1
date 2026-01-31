// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Note the path change!

export default function Dashboard() {
  const [message, setMessage] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch data from the backend
    api.get('/')
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        console.error(err);
        // If the token is invalid (401), force logout
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else {
          setMessage('Error connecting to server');
        }
      });
  }, []);

  const handleLogout = () => {
    // 2. Clear token and redirect to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded mb-6">
          <p className="text-green-700 font-medium">Status: {message}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 w-full">
          <Link 
            to="/rooms" 
            className="bg-blue-500 text-white py-3 rounded text-center hover:bg-blue-600 font-medium"
          >
            Manage Rooms
          </Link>
          {/* Placeholder for later */}
          <button className="bg-gray-300 text-gray-600 py-3 rounded cursor-not-allowed">
            Bookings (Soon)
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}