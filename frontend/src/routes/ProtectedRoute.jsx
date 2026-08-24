// ProtectedRoute.jsx
// Wraps a route — if user is NOT logged in, redirect to /

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the actual page
  return children;
}

export default ProtectedRoute;
