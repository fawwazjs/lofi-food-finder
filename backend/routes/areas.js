const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
}

// GET /api/areas - list areas
router.get('/', async (req, res) => {
  try {
    const areas = await Area.find().lean();
    res.json(areas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/areas - create area
router.post('/', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const computedSlug = slug || slugify(name || '');
    const a = new Area({ name, slug: computedSlug, description });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// POST /api/areas/seed - seed default areas (idempotent)
router.post('/seed', async (req, res) => {
  try {
    const defaults = req.body?.areas || ['Keputih', 'Mulyosari', 'Gebang', 'Manyar'];
    const created = [];
    for (const name of defaults) {
      const slug = slugify(name);
      let a = await Area.findOne({ $or: [{ slug }, { name }] });
      if (!a) {
        a = new Area({ name, slug });
        await a.save();
        created.push(a);
      }
    }
    const all = await Area.find().lean();
    res.json({ created, all });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to seed areas' });
  }
});

module.exports = router;
