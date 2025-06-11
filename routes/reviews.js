const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

router.post('/', auth(['user']), async (req, res) => {
  try {
    const review = new Review({ ...req.body, userId: req.user.id });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/rental/:rentalId', auth(['user']), async (req, res) => {
  try {
    const reviews = await Review.find({ rentalId: req.params.rentalId }).populate('userId', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;