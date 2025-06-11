const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const moment = require('moment');
const Entry   = require('../models/HoroscopeEntry');
// Horoscope Data
const dailyHoroscopes = {
    Aries: "Today is energetic and fulfilling.",
    Taurus: "Stay grounded and patient.",
    Gemini: "Communication is key today.",
    Cancer: "Embrace your emotions and intuition.",
    Leo: "Your creativity shines bright today.",    
    Virgo: "Focus on details and organization.",
    Libra: "Seek balance in your relationships.",
    Scorpio: "Transformation is on the horizon.",
    Sagittarius: "Adventure awaits you today.",
    Capricorn: "Hard work will pay off soon.",
    Aquarius: "Innovative ideas will flow today.",
    Pisces: "Trust your instincts and dreams."
    // Add other zodiac signs
};

// Get Today's Horoscope
router.get('/today', authMiddleware, async (req, res) => {
    const today   = moment().format('YYYY-MM-DD');
    const zodiac  = req.user.zodiac;
    const text    = dailyHoroscopes[zodiac];
  
    if (!req.user.horoscopeHistory.some(e => e.date === today)) {
      req.user.horoscopeHistory.push({ date: today, horoscope: text });
  
      if (req.user.horoscopeHistory.length > 7) {
        req.user.horoscopeHistory.shift();
      }
      await req.user.save();
  
      await Entry.create({
        user:      req.user._id,
        date:      today,
        zodiac,
        horoscope: text
      });
    }
  
    res.send({ zodiac, date: today, horoscope: text });
});

// Get Horoscope History
router.get('/history', authMiddleware, async (req, res) => {
    const today       = moment().format('YYYY-MM-DD');
    const sevenDaysAgo= moment().subtract(6, 'days').format('YYYY-MM-DD');
    
    let history = req.user.horoscopeHistory
      .filter(e => e.date >= sevenDaysAgo && e.date <= today);
  
    
    if (history.length === 0) {
      history = [...req.user.horoscopeHistory];
    }
  
    history = history
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  
    res.send({
      zodiac: req.user.zodiac,
      history
    });
});

module.exports = router;