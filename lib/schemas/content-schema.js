'use strict';
const mongoose = require('mongoose');
const content = mongoose.Schema({
  name: { type: String, required: true },
  temperature: {type: String, required: true},
  state: {type: String, required: true},
  date: {type: String, required: true},
},
);
module.exports = mongoose.model('content', content);