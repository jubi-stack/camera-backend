const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    cameraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rentalDays: { type: Number, min: 1 },
    type: { type: String, enum: ['buy', 'rent'], required: true },
    total: { type: Number, required: true, min: 0 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);