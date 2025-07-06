const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const onboardingRoutes = require('./routes/onboardingRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads like base64 signature
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Cleaned)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    // Start server after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/onboarding', onboardingRoutes);
