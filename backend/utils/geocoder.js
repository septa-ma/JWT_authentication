const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEO_PROVIDER,
  // Optional depending on the providers
  httpAdapter: process.env.GEO_ADAPTER,
  apiKey: process.env.GEO_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

