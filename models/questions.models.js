'use strict';

//================================== Import Dependencies ====================>
const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
  user: /*mongoose.Schema.Types.ObjectId*/ String,
  type: Number
});

const QuestionSchema = mongoose.Schema({
  title: String,
  body: String,
  response: String,
  votes: {
    list: [VoteSchema],
    score: {
      type:Number,
      default:0
    }
  },
  user: mongoose.Schema.Types.ObjectId
});


module.exports = mongoose.model('question', QuestionSchema);
