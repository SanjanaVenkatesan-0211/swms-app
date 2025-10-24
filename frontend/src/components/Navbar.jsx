import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    alert("Logged out");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">SWMS</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {!username && <Link to="/register">Register</Link>}
        {!username && <Link to="/login">Login</Link>}

        {/* optional: quick links based on role */}
        {role === "citizen" && <Link to="/citizen">Citizen Dashboard</Link>}
        {role === "driver" && <Link to="/driver">Driver Dashboard</Link>}
        {role === "manager" && <Link to="/manager">Manager Dashboard</Link>}
        {role === "facility_admin" && <Link to="/admin">Admin Dashboard</Link>}

        {username && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
