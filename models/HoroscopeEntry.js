const mongoose = require('mongoose');

const horoscopeEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,    // YYYY-MM-DD
    required: true
  },
  zodiac: {
    type: String,
    required: true
  },
  horoscope: {
    type: String,
    required: true
  }
}, {
  timestamps: true   // optional: createdAt will tell you exactly when it was saved
});

module.exports = mongoose.model('HoroscopeEntry', horoscopeEntrySchema);
