const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Place = require('../models/Place');
const multer = require('multer');
const path = require('path');

// reuse same upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

// GET /api/comments/:placeId - list comments for place
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const comments = await Comment.find({ place: placeId }).sort({ createdAt: -1 }).lean();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// POST /api/comments/:placeId - add comment to place (multipart)
router.post('/:placeId', upload.single('image'), async (req, res) => {
  try {
    const { placeId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Text is required' });

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const commentData = { place: placeId, text };
    if (req.file) {
      const host = req.protocol + '://' + req.get('host');
      commentData.image = `${host}/uploads/${req.file.filename}`;
    }

    const c = new Comment(commentData);
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
});

module.exports = router;
