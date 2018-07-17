'use strict';
//================================== Import Dependencies ====================>
const User = require('../models/users.models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwtAuth = require('../utils/jwtAuth');

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
  

  User.create(newUser)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(next);
});



//================================== Edit User Information ====================>


router.put('/users/:id', jwtAuth, (req,res,next) => {
  const {id} = req.params;
  if (req.user.id !== req.params.id) {
    const err = new Error();
    err.status = 403;
    err.message = 'Unauthorized. Your cannot change other user\'s data unless you are an administrator';
    return next(err);
  }


  const {requestType} = req.body;

  if (!requestType) {
    const err = new Error();
    err.status = 400;
    err.message = 'No request type provided in request body';
  }

  if (requestType === 'topLevel') {
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

    return User.findByIdAndUpdate(id, updateObj, {new:true})
      .then(response => {
        res.status(201).json(response);
      })
      .catch(next);
  }

  if (requestType === 'followUser') {

    // Extract Follower ID from Request Body
    const {idOfUserToFollow} = req.body;

    // Verify the ID for the user to follow has been provided
    if (!idOfUserToFollow) {
      const err = new Error();
      err.status = 400;
      err.message = 'No Follower Id provided in Request Body';
      return next(err);
    }
    
    // Validate the FollowerID with mongoose. If Invalid, return error
    if (!mongoose.Types.ObjectId.isValid(idOfUserToFollow)) {
      const err = new Error();
      err.status = 400;
      err.message = 'Invalid User ID Provided';
      return next(err);
    }

    //Verify the user is not trying to follow themselves

    if (idOfUserToFollow.toString() === req.user.id.toString()) {
      const err = new Error();
      err.status = 400;
      err.message = 'Cannot follow oneself';
      return next(err);
    }


    return User.findById(id)
      .then(response => {
        const alreadyFollowing = response.following.find(user => {
          return user.user.toString() === idOfUserToFollow.toString();
        });

        if (alreadyFollowing) {
          const err = new Error();
          err.status = 400;
          err.message = 'Already following this user';
          return next(err);
        }

        User.findByIdAndUpdate(id, 
          {
            $push: {
              following: {user: idOfUserToFollow}
            }
          },
          {new:true}
        )
          .then(response => {
            res.status(200).json(response);
          })
          .catch(next);
      });
  }
  
  if (requestType === 'unfollowUser') {

    // Extract Follower ID from Request Body
    const {idOfUserToUnFollow} = req.body;

    // Verify the ID for the user to follow has been provided
    if (!idOfUserToUnFollow) {
      const err = new Error();
      err.status = 400;
      err.message = 'No Follower Id provided in Request Body';
      return next(err);
    }

    // Validate the FollowerID with mongoose. If Invalid, return error
    if (!mongoose.Types.ObjectId.isValid(idOfUserToUnFollow)) {
      const err = new Error();
      err.status = 400;
      err.message = 'Invalid User ID Provided';
      return next(err);
    }

    User.findById(id)
      .then(response => {
        const alreadyFollowing = response.following.find(user => {
          return user.user.toString() === idOfUserToUnFollow.toString();
        });

        if (!alreadyFollowing) {
          const err = new Error();
          err.status = 400;
          err.message = 'Not following this user';
          return next(err);
        }

        User.findByIdAndUpdate(id, 
          {
            $pull: {
              following: {user: idOfUserToUnFollow}
            }
          },
          {new:true}
        )
          .then(response => {
            res.status(200).json(response);
          })
          .catch(next);
      });
  }

});


module.exports = router;