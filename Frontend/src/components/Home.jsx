import './Home.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


export const Home = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/createroom');
  };

  const handleJoinRoom = () => {
    navigate('/joinroom');
  };

  return (
    <div className="home-container">
      <div className="choice-container">
        <motion.button onClick={handleJoinRoom}>Join Room</motion.button>
        <motion.button 
         intial={{y:-20,opacity:0.1}}
         animate={{y:0,opacity:1}}
        onClick={handleCreateRoom}>
          Create Room
          </motion.button>
      </div>
    </div>
  );
};
