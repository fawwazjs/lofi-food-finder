const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// Serve uploaded files
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Models
const Area = require('./models/Area');
const Place = require('./models/Place');
const User = require('./models/User');

// Routes
const areasRouter = require('./routes/areas');
const placesRouter = require('./routes/places');
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');

app.use('/api/areas', areasRouter);
app.use('/api/places', placesRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentsRouter);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server with retry logic
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://akemifukuoka00_db_user:DaqCUUdaRG3HVUHH@gresikinfohub.jifjocv.mongodb.net/?appName=gresikinfohub';

const connectWithRetry = async (retries = 0) => {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(`Failed to connect to MongoDB (attempt ${retries + 1})`, err.message || err);
    const maxRetries = 10;
    const delayMs = 3000;
    if (retries < maxRetries) {
      console.log(`Retrying MongoDB connection in ${delayMs / 1000}s...`);
      setTimeout(() => connectWithRetry(retries + 1), delayMs);
    } else {
      console.error('Exceeded maximum MongoDB connection attempts. Exiting.');
      process.exit(1);
    }
  }
};

connectWithRetry();
