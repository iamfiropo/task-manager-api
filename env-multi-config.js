const { config } = require('dotenv');

config()

const envConfig = {
  dev: {
    MONGODB_URI: process.env.MONGODB_URI
  },
  test: {
    MONGODB_URI: process.env.MONGODB_URI_TEST
  }
}

module.exports = {
  envConfig
}