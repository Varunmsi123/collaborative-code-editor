import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Register.css'

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please enter name, email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      toast.success(res.data?.message || "Registered successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/"),
      });

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={register}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};
