const express = require('express');
const router = express.Router();
const Camera = require('../models/Camera');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category: new RegExp(category, 'i') } : {};
    const cameras = await Camera.find(query);
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sample', async (req, res) => {
  try {
    const cameras = await Camera.find().limit(4);
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json(camera);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const camera = new Camera(req.body);
    await camera.save();
    res.status(200).json({ message: 'Camera added successfully', camera });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json({ message: 'Camera updated successfully', camera });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json({ message: 'Camera deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;