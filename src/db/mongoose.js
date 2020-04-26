const mongoose = require('mongoose');
const { config } = require('dotenv');

const { envConfig: { dev, test } } = require('../../env-multi-config');

config()

const MONGODB_URL = process.env.NODE_ENV === 'test' ? test.MONGODB_URI : dev.MONGODB_URI

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});