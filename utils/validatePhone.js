// utils/validatePhone.js
const { isValidPhoneNumber } = require('libphonenumber-js');

const validatePhone = (phone) => {
  try {
    return isValidPhoneNumber(phone);
  } catch (error) {
    return false;
  }
};

module.exports = validatePhone;