const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const seedDemoData = require('./config/seed');

const app = express();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
