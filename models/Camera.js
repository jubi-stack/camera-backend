const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  rentalPrice: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  rentalDays: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Camera', cameraSchema);