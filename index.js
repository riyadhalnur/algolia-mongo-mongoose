'use strict';

const mongoose = require('mongoose');
const fixtures = require('pow-mongoose-fixtures');
const async = require('async');

const search = require('./controllers/search');

require('./models/User.js');

mongoose.connect('mongodb://localhost/algolia-demo');

let db = mongoose.connection;

const loadData = (callback) => {
  console.log('Loading data into DB...');
  fixtures.load(__dirname + '/fixtures/users.js', db, callback);
};

const indexData = (callback) => {
  console.log('Sending data to Algolia for indexing...');

  mongoose.model('User').find({}).exec((err, users) => {
    if (err) {
      return callback(err);
    }

    search.add('User', users, callback);
  });
};

const searchData = (callback) => {
  console.log('Searching for a name from our data...');
  search.doSearch('User', 'Burger', callback);
};

db.on('error', console.error.bind(console, 'Error connecting to DB:'));
db.once('open', () => {
  console.log('Conected to the DB!');

  async.series([
    loadData,
    indexData,
    searchData
  ], (err, results) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('Search results:', results);
    mongoose.connection.close(() => {
      console.log('Closing connection and exiting!');
      process.exit();
    });
  });
});
