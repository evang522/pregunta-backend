'use strict';
//================================== Import Depedencies ====================>
const mongoose = require('mongoose');


//================================== Construct User Model ====================>

const FollowingUserSchema = mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId
}, {_id:false});

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
  },
  created: {
    type:Date,
    default: () => new Date()
  },
  followers: [FollowingUserSchema],
  following: [FollowingUserSchema]

});


module.exports = mongoose.model('user', UserSchema);