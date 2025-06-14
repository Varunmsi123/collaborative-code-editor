import React from 'react';
import { Routes, Route } from 'react-router-dom'
import {Home} from './components/Home';
import {Createroom} from './components/Createroom';
import {Login} from './components/Login';
import {Register} from './components/Register';
import Room from './components/Room';
import JoinRoom from './components/Joinroom';

function App() {
  return (
    <div className="App">
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/home" element={<Home />} />
  <Route path="/createroom" element={<Createroom />} />
  <Route path="/joinroom" element={<JoinRoom />} />
  <Route path="/room/:roomid" element={<Room />} />
  <Route path="/editor/:roomid" element={<Room />} /> {/* Add this */}
</Routes>

    </div>
  );
}

export default App;
