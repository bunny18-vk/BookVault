import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="../assets/9.png" alt="Library Logo" />
        <h2>Library Management System</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/student-login">Student Login</Link></li>
        <li><Link to="/admin-login">Admin Login</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
