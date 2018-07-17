'use strict';
//================================== Import Dependencies ====================>
const User = require('../models/users.models');
const express = require('express');
const router = express.Router();


//================================== GET User Route ====================>
router.get('/users', (req,res,next) => {
  const {handle, email, name} = req.body;


  User.find({$or: [{name: name}, {handle:handle}]})
    .then(response => {
      res.json(response);
    })
    .catch(next);
});


//================================== Get User By Id ====================>


router.get('/users/:id', (req,res,next) => {
  const {id} = req.params;

  User.findById(id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(next);
});


//================================== Edit User Information ====================>


router.put('/users/:id', (req,res,next) => {
  const acceptedUpdates = ['handle','email','name','aboutme','shortbio']; 
  


});