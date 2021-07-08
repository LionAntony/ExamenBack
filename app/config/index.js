
require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  authJwtSecret: process.env.AUTH_JWT_SECRET
};

module.exports = { config };