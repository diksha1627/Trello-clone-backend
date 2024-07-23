const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(session({
    secret: 'diksha',
    resave: false,
    saveUninitialized: false
  }));
  
// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const listRoutes = require('./routes/lists');
const cardRoutes = require('./routes/cards');

app.use('/api/auth', authRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
