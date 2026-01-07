import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://online-assessment-platform-backend-1.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);
      // ✅ SUPPORT MULTIPLE BACKEND RESPONSE SHAPES
      const user =
        res.data.user || // preferred
        res.data.data || // common pattern
        res.data; // fallback

      if (!user || !user.role) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Error logging in");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="border p-6 rounded w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
