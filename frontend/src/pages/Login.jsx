import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(form);

      // store username + role so dashboards can use them
      if (result.username) localStorage.setItem("username", result.username);
      if (result.role) localStorage.setItem("role", result.role);

      // success popup
      alert("✅ Login successful!");

      // navigate by role
      switch (result.role) {
        case "citizen":
          navigate("/citizen");
          break;
        case "driver":
          navigate("/driver");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "facility_admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      // show backend error message (user-friendly)
      alert("❌ " + (err.message || "Login failed"));
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
