import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Joinroom.css';

const JoinRoom = () => {
  const [roomid, setRoomid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post("http://localhost:5000/joinroom", {
        roomid,
        password,
      });

      localStorage.setItem("roomid", roomid);
      localStorage.setItem("language", response.data.language);
      navigate(`/editor/${roomid}`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to join room");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Join a Room</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleJoin}>
        <label>Room ID</label>
        <input
          type="text"
          value={roomid}
          onChange={(e) => setRoomid(e.target.value)}
          required
        />
        <label>Room Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default JoinRoom;
