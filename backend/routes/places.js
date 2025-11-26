const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Area = require('../models/Area');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
}

// multer setup
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

// GET /api/places - list places (optionally by area id or slug/name)
router.get('/', async (req, res) => {
  try {
    const { area } = req.query; // may be ObjectId or slug/name
    const filter = {};
    if (area) {
      // If area looks like an ObjectId, use it directly
      if (mongoose.Types.ObjectId.isValid(area)) {
        filter.area = area;
      } else {
        // otherwise treat as slug or name (case-insensitive)
        const a = await Area.findOne({ $or: [{ slug: area }, { name: new RegExp(`^${area}$`, 'i') }] }).lean();
        if (a) filter.area = a._id;
        else {
          // no matching area -> return empty list
          return res.json([]);
        }
      }
    }
    const places = await Place.find(filter).populate('area').lean();
    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching places' });
  }
});

// GET /api/places/:id - get place
router.get('/:id', async (req, res) => {
  try {
    const p = await Place.findById(req.params.id).populate('area').lean();
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST /api/places - create place
// POST with multipart/form-data
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let { name, description, area, address, lat, lng, openHours, rating, menu } = req.body;

    // parse menu if provided as JSON string
    if (menu && typeof menu === 'string') {
      try {
        menu = JSON.parse(menu);
      } catch (e) {
        // ignore parse error, leave as string
      }
    }

    // convert numeric fields
    if (lat) lat = parseFloat(lat);
    if (lng) lng = parseFloat(lng);
    if (rating) rating = parseFloat(rating);

    // If area provided as slug/name, resolve to ObjectId
    if (area && !mongoose.Types.ObjectId.isValid(area)) {
      let a = await Area.findOne({ $or: [{ slug: area }, { name: new RegExp(`^${area}$`, 'i') }] });
      if (!a) {
        // create new area if not found
        const slug = slugify(area);
        try {
          a = new Area({ name: area, slug });
          await a.save();
        } catch (e) {
          // if creation failed due to duplicate slug/name race, try to find again
          a = await Area.findOne({ $or: [{ slug }, { name: new RegExp(`^${area}$`, 'i') }] });
        }
      }
      if (!a) return res.status(400).json({ message: 'Area not found' });
      area = a._id;
    }

    const placeData = { name, description, area, address, lat, lng, openHours, rating, menu };
    if (req.file) {
      const host = req.protocol + '://' + req.get('host');
      placeData.image = `${host}/uploads/${req.file.filename}`;
    }

    const p = new Place(placeData);
    await p.save();
    const populated = await Place.findById(p._id).populate('area').lean();
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    // send validation details when possible
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(400).json({ message: 'Invalid data while creating place' });
  }
});

// PUT /api/places/:id - update place (supports multipart/form-data)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.menu && typeof update.menu === 'string') {
      try { update.menu = JSON.parse(update.menu); } catch (e) {}
    }
    if (update.lat) update.lat = parseFloat(update.lat);
    if (update.lng) update.lng = parseFloat(update.lng);
    if (update.rating) update.rating = parseFloat(update.rating);

    if (update.area && !mongoose.Types.ObjectId.isValid(update.area)) {
      let a = await Area.findOne({ $or: [{ slug: update.area }, { name: new RegExp(`^${update.area}$`, 'i') }] });
      if (!a) {
        const slug = slugify(update.area);
        try {
          a = new Area({ name: update.area, slug });
          await a.save();
        } catch (e) {
          a = await Area.findOne({ $or: [{ slug }, { name: new RegExp(`^${update.area}$`, 'i') }] });
        }
      }
      if (!a) return res.status(400).json({ message: 'Area not found' });
      update.area = a._id;
    }

    if (req.file) {
      const host = req.protocol + '://' + req.get('host');
      update.image = `${host}/uploads/${req.file.filename}`;
    }

    const p = await Place.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate('area').lean();
    if (!p) return res.status(404).json({ message: 'Place not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message, errors: err.errors });
    res.status(400).json({ message: 'Invalid data while updating place' });
  }
});

module.exports = router;
