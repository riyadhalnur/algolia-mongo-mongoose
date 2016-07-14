'use strict';

const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    index: true
  }
});

// Full name
UserSchema
  .virtual('name.full')
  .get(function () {
    return this.name.first + ' ' + this.name.last;
  });

mongoose.model('User', UserSchema);
