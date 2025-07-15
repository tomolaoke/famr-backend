// controllers/authController.js
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const validatePhone = require('../utils/validatePhone');
const queueAction = require('../utils/queueAction');
const { countries } = require('countries-list');

exports.signup = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('confirmPassword', 'Confirm password is required').exists(),
  check('pin', 'PIN must be 4-6 digits').isLength({ min: 4, max: 6 }),
  check('phone', 'Valid phone number is required').custom((value) => validatePhone(value)),
  check('country', 'Country is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('currency', 'Currency is required').not().isEmpty(),
  check('language', 'Language is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, confirmPassword, pin, phone, country, state, city, currency, language } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const countryData = Object.values(countries).find(c => c.name === country);
    if (!countryData || countryData.currency !== currency) {
      return res.status(400).json({ message: 'Invalid currency for the selected country' });
    }

    try {
      let user = await User.findOne({ $or: [{ email }, { phone }] });
      if (user) {
        return res.status(400).json({ message: 'Email or phone already exists' });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
        pin,
        phone,
        country,
        state,
        city,
        currency,
        language,
      });

      if (email === process.env.ADMIN_EMAIL) {
        user.role = 'Admin';
        user.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      }

      await user.save();
      res.json({ userId: user._id, message: 'Signed up!' });
    } catch (error) {
      console.error('Signup error:', error.message);
      // Queue for offline sync
      await queueAction(null, 'signup', req.body);
      res.status(503).json({ message: 'Server unavailable, action queued for sync', queued: true });
    }
  },
];

exports.login = [
  async (req, res, next) => {
    const Activity = require('../models/Activity');
    const activity = new Activity({
      userId: null,
      action: 'login',
      timestamp: Date.now(),
    });
    req.activity = activity;
    next();
  },
  async (req, res) => {
    const { email, phone, password, pin } = req.body;

    try {
      let user;
      if (email && password) {
        user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else if (phone && pin) {
        user = await User.findOne({ phone });
        if (!user || !(await user.matchPin(pin))) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        return res.status(400).json({ message: 'Provide email/password or phone/PIN' });
      }

      req.activity.userId = user._id;
      await req.activity.save();

      const token = generateToken(user);
      res.json({ token, message: 'Logged in!' });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(503).json({ message: 'Server unavailable, try again later' });
    }
  },
];