const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const taskRoutes = require('./routes/taskRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const chatRoutes = require('./routes/chatRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const seedDemoData = require('./config/seed');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI not set. Defaulting to mongodb://127.0.0.1:27017/greythr');
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/greythr';
}
connectDB();
seedDemoData();

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/onboarding', onboardingRoutes);

const io = new Server(server, { cors: { origin: '*'} });

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    socket.join(roomId);
  });
  socket.on('message', (payload) => {
    if (payload && payload.roomId) {
      io.to(payload.roomId).emit('message', payload);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
