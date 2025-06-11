const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const cameraRoutes = require('./routes/cameras');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const connectDB = require('./config/db');

// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Debug environment variables
console.log('Environment Variables Loaded:');
console.log('  .env Path:', envPath);
console.log('  MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Undefined');
console.log('  PORT:', process.env.PORT || 'Undefined');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Undefined');
console.log('  RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'Undefined');
console.log('  RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Undefined');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));