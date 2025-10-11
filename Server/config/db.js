// Server/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  'mongodb://host.docker.internal:27017/foodapp';

mongoose.connection.on('connected', () => {
  console.log('mongoose connected to', uri);
});
mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected');
});
mongoose.connection.on('error', (err) => {
  console.error('db connection error:', err.message);
});

(async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    console.error('initial connect failed:', err.message);
  }
})();
