const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Define the path to the .env file
const envPath = path.resolve(__dirname, '.env');

// Check if the .env file exists
try {
  if (fs.existsSync(envPath)) {
    console.log('.env file found at:', envPath);
    console.log('File contents:\n', fs.readFileSync(envPath, 'utf8'));
  } else {
    console.log('.env file not found at:', envPath);
    process.exit(1);
  }
} catch (error) {
  console.error('Error checking .env file:', error.message);
  process.exit(1);
}

// Load environment variables
dotenv.config({ path: envPath });

// Debug environment variables
console.log('\nEnvironment Variables After Loading:');
console.log('  MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Undefined');
console.log('  PORT:', process.env.PORT || 'Undefined');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Undefined');
console.log('  RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'Undefined');
console.log('  RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Undefined');