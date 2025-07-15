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

  // Accept both currency codes and names (case-insensitive)
  let validCurrencies = [];
  if (countryEntry.currency) {
    if (typeof countryEntry.currency === 'string') {
      validCurrencies = countryEntry.currency.split(',').map((c) => c.trim().toLowerCase());
    } else if (Array.isArray(countryEntry.currency)) {
      validCurrencies = countryEntry.currency.map((c) => c.trim().toLowerCase());
    }
  }
  // Add common currency names for Nigeria (expand as needed for other countries)
  if (countryEntry.name.toLowerCase() === 'nigeria') {
    validCurrencies.push('naira', 'nigerian naira');
  }
  if (!validCurrencies.includes(currency.toLowerCase())) {
    return { isValid: false, message: 'Invalid currency for the selected country' };
  }
  return { isValid: true };
};

module.exports = validateCountryAndCurrency;