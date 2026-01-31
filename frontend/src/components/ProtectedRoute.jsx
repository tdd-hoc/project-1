// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if the token exists in local storage
  const token = localStorage.getItem('token');

  // If token exists, render the child component (the Dashboard)
  // If not, redirect to the Login page
  return token ? children : <Navigate to="/login" replace />;
}