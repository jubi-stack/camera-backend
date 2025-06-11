// routes/orders.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initiate Payment
router.post('/initiate-payment', auth(['user']), async (req, res) => {
  try {
    const { items } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty items array' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const rentalDays = item.type === 'rent' ? (Number(item.rentalDays) || 1) : 1;
      return sum + price * rentalDays;
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Save order to database
    const dbOrder = new Order({
      userId: req.user.id,
      items: items.map(item => ({
        cameraId: item.cameraId,
        name: item.name,
        price: Number(item.price),
        rentalDays: item.type === 'rent' ? Number(item.rentalDays) || 1 : null,
        type: item.type,
        total: Number(item.total),
      })),
      totalAmount: totalAmount,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    await dbOrder.save();

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: dbOrder._id,
    });
  } catch (error) {
    console.error('Initiate Payment Error:', error);
    res.status(500).json({ message: error.message || 'Failed to initiate payment' });
  }
});

// Verify Payment
router.post('/verify-payment', auth(['user']), async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = req.body;

    // Validate input
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !dbOrderId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order status in database
    const order = await Order.findById(dbOrderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.status = 'completed';
    await order.save();

    res.status(200).json({ order });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
});

// Get User Orders
router.get('/user', auth(['user']), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('userId', 'username email phone');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get All Orders (Admin)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email phone');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;