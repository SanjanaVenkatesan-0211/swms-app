import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    user_id: "",
    name: "",
    role: "citizen",
    contact_info: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(form);

      // Success popup
      alert("✅ " + result.message);
      
      // Reset form
      setForm({
        user_id: "",
        name: "",
        role: "citizen",
        contact_info: "",
        username: "",
        password: "",
      });

      // Navigate to login
      navigate("/login");
    } catch (err) {
      // Error popup
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
        />
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="citizen">Citizen</option>
          <option value="driver">Driver</option>
          <option value="manager">Manager</option>
          <option value="facility_admin">Facility Admin</option>
        </select>
        <input
          name="contact_info"
          placeholder="Contact Info"
          value={form.contact_info}
          onChange={handleChange}
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
