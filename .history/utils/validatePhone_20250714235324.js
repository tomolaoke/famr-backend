// utils/validatePhone.js
const { isValidPhoneNumber } = require('libphonenumber-js');

// Validate phone number with country code
const validatePhone = (phone) => {
  try {
    return isValidPhoneNumber(phone);
  } catch (error) {
    return false;
  }
};

module.exports = validatePhone;