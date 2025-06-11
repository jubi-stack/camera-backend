const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug environment variables
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Undefined');

const insertData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB for data insertion');

    // Define sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: new Date(),
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        createdAt: new Date(),
      },
    ];

    // Insert users into the database
    await User.deleteMany({}); // Clear existing users (optional, remove if you don't want to clear)
    const insertedUsers = await User.insertMany(users);
    console.log('Users inserted successfully:', insertedUsers);

  } catch (error) {
    console.error('Error inserting data:', error.message);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

// Run the insertion script
insertData();