import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // import Navbar
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CitizenDashboard from "./pages/CitizenDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Navbar />  {/* Navbar added here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
