const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  
const moment = require('moment');

// Zodiac Detection
const getZodiacSign = (birthdate) => {
    const day = birthdate.date(), month = birthdate.month() + 1;
    const zodiacSigns = [
        ["Capricorn", 20], ["Aquarius", 19], ["Pisces", 20], ["Aries", 20],
        ["Taurus", 21], ["Gemini", 21], ["Cancer", 22], ["Leo", 22],
        ["Virgo", 23], ["Libra", 23], ["Scorpio", 22], ["Sagittarius", 21], ["Capricorn", 31]
    ];
    return day > zodiacSigns[month - 1][1] ? zodiacSigns[month][0] : zodiacSigns[month - 1][0];
};


// Signup API
router.post('/signup', async (req, res) => {
    const { name, email, password, birthdate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const zodiac = getZodiacSign(moment(birthdate));

    try {
        const user = new User({ name, email, password: hashedPassword, birthdate, zodiac });
        await user.save();
        res.status(201).send({ message: 'User created', zodiac });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);
    const user = await User.findOne({ email });
    const jwtSecret = process.env.JWT_SECRET;
    console.log("JWT Secret:", jwtSecret);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
});

module.exports = router;