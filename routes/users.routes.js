'use strict';
//================================== Import Dependencies ====================>
const User = require('../models/users.models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


//================================== GET User Route ====================>
router.get('/users', (req,res,next) => {
  const {handle, email, name} = req.body;


  User.find({$or: [{name}, {handle}, {email}]})
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

//================================== Create New User ====================>

router.post('/users', (req,res,next) => {
  console.log('HIIIII');
  const requiredFields = ['handle','email','name','password'];
  let err;
  const newUser = {};

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const _err = new Error();
      _err.status = 400;
      _err.message = `Missing ${field} field`;
      err = _err;
    }
    
    newUser[field] = req.body[field];
  });

  if (err) {
    return next(err);
  }

  newUser.password = bcrypt.hashSync(newUser.password, 10);
  
  console.log('hi');

  User.create(newUser)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(next);
});



//================================== Edit User Information ====================>


router.put('/users/:id', (req,res,next) => {
  const {id} = req.params;
  const acceptedUpdates = ['handle','email','name','aboutme','shortbio']; 
  const updateObj = {};

  acceptedUpdates.forEach(update => {
    if (req.body[update]) {
      updateObj[update] = req.body[update];
    }
  });

  if (!Object.keys(updateObj).length) {
    const err = new Error();
    err.status = 400;
    err.message = 'No Updates Provided';
    return next(err);
  }

  User.findByIdAndUpdate(id, updateObj, {new:true})
    .then(response => {
      res.status(201).json(response);
    })
    .catch(next);
});


module.exports = router;