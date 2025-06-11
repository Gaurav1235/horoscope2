// app.js
const express = require('express');
require('dotenv').config();
const app = express();
const {apiLimiter} = require('./middleware/ratelimiter');
const connectDB = require('./db');

const apiBase = `/api/v1`;

connectDB();

app.use(express.json());

const userRoute = require('./routes/userRoutes');
const horoscopeRoute = require('./routes/horoscopeRoutes');

// Middleware: Rate Limiting
app.use(apiLimiter);
app.use(`${apiBase}/users`, userRoute);
app.use(`${apiBase}/horoscope`, horoscopeRoute);


app.listen(3000, () => console.log('Horoscope app running on port 3000'));
