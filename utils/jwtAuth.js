'use strict';

//================================== Import Dependencies ====================>

const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
const {JWT_SECRET} = require('../config');


//================================== JWT Strategy Middleware ====================>

const jwtAuth = (req,res,next) => {
  if(!req.get('Authorization')) {
    const err = new Error();
    err.status = 403;
    err.message = 'No Authorization Header provided';
    return next(err);
  }

  if (req.get('Authorization').split(' ')[0] !== 'Bearer') {
    const err = new Error();
    err.status = 403;
    err.message = 'Hermes requires a `Bearer` header for authorization. For example, `Bearer <authToken>`';
    return next(err);
  }

  let userInfo;

  // Extract JWT token from Authorization Header
  const authToken = req.get('Authorization').split(' ')[1];
  jwt.verify(authToken,JWT_SECRET, (err,decoded) => {
    if (err) {
      const error = new Error();
      error.status = 403;
      error.message = 'Invalid JWT token provided. Please log in again.';
      return next(error);
    } else {
      userInfo = decoded;
      User.find({'_id':userInfo.id})
        .then(response => {
          if (response.length) {
            req.user = userInfo;
            return next();
          } else {
            const err = new Error();
            err.message = 'JWT Token valid, but user not found in Database. Have you deleted your account?';
            err.status = 403;
            return next(err);
          }
        });
    }
  });
};


module.exports = jwtAuth;