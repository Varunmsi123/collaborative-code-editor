const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = 'mongodb+srv://admin_123:saniya%40123@cluster0.8s7wf.mongodb.net/myappdb?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

const RoomSchema = new mongoose.Schema({
  roomid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, default: "" }
});
const Room = mongoose.model("Room", RoomSchema);

// Routes

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Create Room
app.post("/createroom", async (req, res) => {
  const { password, language } = req.body;
  if (!password || !language) {
    return res.status(400).json({ error: "Password and language are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roomid = uuidv4();

    const newRoom = new Room({ roomid, password: hashedPassword, language });
    await newRoom.save();

    res.status(201).json({ message: "Room created successfully", roomid });
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Join Room
app.post("/joinroom", async (req, res) => {
  const { roomid, password } = req.body;
  try {
    const room = await Room.findOne({ roomid });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const isPasswordValid = await bcrypt.compare(password, room.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect room password" });

    res.status(200).json({ message: "Joined successfully", roomid });
  } catch (err) {
    res.status(500).json({ message: "Failed to join room" });
  }
});

// Get Room Details
app.get("/room/:roomid", async (req, res) => {
  try {
    const room = await Room.findOne({ roomid: req.params.roomid });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: "Error fetching room" });
  }
});

// ✅ Update Code for Room
app.put("/room/:roomid/code", async (req, res) => {
  try {
    const { code } = req.body;
    const room = await Room.findOneAndUpdate(
      { roomid: req.params.roomid },
      { code },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Code updated" });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

// Run Code via Piston API
app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "Code and language required" });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*",
      files: [
        {
          name: `Main.${getFileExtension(language)}`,
          content: code,
        },
      ],
    });

    res.status(200).json({ output: response.data.run.output });
  } catch (err) {
    console.error("Execution error:", err.response?.data || err.message || err);
    res.status(500).json({ output: "Execution failed" });
  }
});

function getFileExtension(language) {
  const map = {
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
    javascript: "js",
  };
  return map[language] || "txt";
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
