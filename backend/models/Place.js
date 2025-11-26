const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  address: { type: String },
  openHours: { type: String },
  rating: { type: Number },
  menu: { type: [String], default: [] },
  image: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Place', PlaceSchema);
