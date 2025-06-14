import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './Createroom.css';

export const Createroom = () => {
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('java');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !language) {
      toast.error("Please enter both language and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/createroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, language }),
      });

      const data = await res.json();

      if (data.roomid) {
        toast.success(`Room created! Redirecting...`);
        setTimeout(() => {
          // Option 1: Pass language as query param
          navigate(`/room/${data.roomid}?lang=${language}`);

          // OR Option 2: Use navigate state (preferred)
          // navigate(`/room/${data.roomid}`, { state: { language } });
        }, 1500);
      } else {
        toast.error(data.error || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create a Room</h2>

        <div className="form-group">
          <label>Room Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter room password"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} required>
            <option value="">-- Select Language --</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>

        <button type="submit">Create Room</button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};
