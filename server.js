const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-room-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle joining study room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });

  // Handle whiteboard updates
  socket.on('whiteboard-update', (roomId, data) => {
    socket.to(roomId).emit('whiteboard-update', data);
  });

  // Handle music sync
  socket.on('music-control', (roomId, data) => {
    socket.to(roomId).emit('music-control', data);
  });

  // Handle chat messages
  socket.on('send-message', (roomId, message) => {
    socket.to(roomId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/rooms', require('./server/routes/rooms'));
app.use('/api/tasks', require('./server/routes/tasks'));
app.use('/api/notes', require('./server/routes/notes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 