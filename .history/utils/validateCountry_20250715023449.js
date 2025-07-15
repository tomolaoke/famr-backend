// utils/validateCountry.js
const { countries } = require('countries-list');

const validateCountryAndCurrency = (country, currency) => {
  // Map country name to country code
  const countryEntry = Object.values(countries).find(
    (c) => c.name.toLowerCase() === country.toLowerCase()
  );
  if (!countryEntry) {
    return { isValid: false, message: 'Invalid country' };
  }
  if (countryEntry.currency !== currency) {
    return { isValid: false, message: 'Invalid currency for the selected country' };
  }
  return { isValid: true };
};

module.exports = validateCountryAndCurrency;