import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/admin/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminName", response.data.admin.name);

        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid Admin Email or Password");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-bg-glow one"></div>
      <div className="admin-bg-glow two"></div>

      <form className="admin-login-box" onSubmit={handleLogin}>
        <div className="admin-login-logo">
          NextStep <span>CV</span>
        </div>

        <p className="admin-login-subtitle">Admin Dashboard</p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;