// Navbar.jsx
// Navigation bar with React Router links.
// Uses useContext to show login/logout based on auth state.

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { member, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <span className="nav-brand">🏋️ FitZone</span>
      <div className="nav-links">
        {/* React Router Links — no full page reload */}
        <Link to="/classes">Classes</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/admin">Admin Panel</Link>
        {member ? (
          <button onClick={handleLogout}>Logout ({member.name})</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
