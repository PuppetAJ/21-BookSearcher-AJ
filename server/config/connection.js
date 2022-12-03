// Imports
const mongoose = require('mongoose');

// Connect to DB using either MONGODB_URI or local host url
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Export connection
module.exports = mongoose.connection;
