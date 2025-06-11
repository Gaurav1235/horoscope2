const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    birthdate: Date,
    zodiac: String,
    horoscopeHistory: [{ date: String, horoscope: String }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
