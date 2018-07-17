'use strict';
//================================== Import Depedencies ====================>
const mongoose = require('mongoose');


//================================== Construct User Model ====================>


const UserSchema = mongoose.Schema({
  handle: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required: true
  },
  name: {
    type: String,
    required:true,
  },
  preferences: {
    type:Object
  },
  shortbio: {
    type:String
  },
  aboutme: {
    type:String
  },
  password: {
    type:String,
    required:true
  }

});


module.exports = mongoose.model('user', UserSchema);