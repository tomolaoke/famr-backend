// controllers/authController.js
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validatePhone = require('../utils/validatePhone');
const validateCountryAndCurrency = require('../utils/validateCountry');

exports.signup = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('confirmPassword', 'Confirm password is required').not().isEmpty(),
  check('pin', 'PIN must be 4 digits').isLength({ min: 4, max: 4 }).isNumeric(),
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

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      pin,
      phone,
      country,
      state,
      city,
      currency,
      language,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Normalize language
    const normalizedLanguage = language.toLowerCase() === 'english' ? 'en' : language;

    // Validate country and currency
    const { isValid, message } = validateCountryAndCurrency(country, currency);
    if (!isValid) {
      return res.status(400).json({ message });
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
        language: normalizedLanguage,
      });

      await user.save();

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ userId: user.id, token, message: 'You have been Signed up!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

exports.login = async (req, res) => {
  const { email, password, phone, pin } = req.body;

  if (!((email && password) || (phone && pin))) {
    return res.status(400).json({ message: 'Provide email/password or phone/PIN' });
  }

  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = email
      ? await user.matchPassword(password)
      : await user.matchPin(pin);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Logged in!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};