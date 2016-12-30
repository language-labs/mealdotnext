const mongoose = require('mongoose');
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGOURI : require('./config-db.js').mongoURI;

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Mongodb connection open'));

module.exports = db;
