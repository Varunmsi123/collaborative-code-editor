import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        {
          validateStatus: (status) => [200, 401, 404].includes(status)
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Login successful", {
          onClose: () => navigate("/home"),
          autoClose: 2000,
        });
      } else if (res.status === 401 || res.status === 404) {
        toast.error(res.data.message || "User not found or incorrect password");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <br /><br />
      <Link to="/register">Don't have an account? Register here</Link>

      <ToastContainer position="top-center" />
    </div>
  );
};
