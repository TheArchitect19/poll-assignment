require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  MONGO_URI: process.env.MONGO_URI
};