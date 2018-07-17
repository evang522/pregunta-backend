'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Question = require('../models/questions.models');

//================================== Questions Route ====================>

router.get('/questions', (req,res,next) => {
  //Todo SORT BY VOTE TOTAL
  // Query UserNAME
  const {userId} = req.query;
  
  Question.find({user: userId})
    .sort({'votes.score': 1})
    .then(response => {
      res.status(200).json(response);
    })
    .catch(next);
});

//================================== POST Route ====================>


router.post('/questions', (req,res,next) => {

  console.log(req.body);
  const validatorFields = ['title','body'];
  const newPost = {};
  let err;


  validatorFields.forEach(field => {
    if (!req.body[field]) {
      const error = new Error();
      error.message = `Missing ${field} field`;
      error.status = 400;
      return err = error;
    }
    
    newPost[field] = req.body[field];
  });

  if (err) {
    return next(err);
  }

  Question.create(newPost)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(next);

});


//================================== PUT ROUTE ====================>
router.put('/questions/:id', (req,res,next) => {
  // TODO Throw error if no updates are provided
  const {id} = req.params;

  // Check to ensure that request Type is present (request type tells the program how to intepret the data accompanying the request)
  if (!req.body.requestType) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing Request Type Specification in Request Body';
    return next(err);
  }

  // Conditional Logic for dealing with Top-Levl Requests. These requests deal with info such as the Title, Body, and Response of Questions
  if (req.body.requestType === 'topLevel') {
    const acceptedFields = ['title','body','response'];
    const updateObj = {};

    acceptedFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];      
      }
    });

    return Question.findByIdAndUpdate(id, updateObj, {new:true})
      .then(response => {
        res.status(200).json(response);
      })
      .catch(next);

  }

  // Logic to Add votes. Adding a vote records the user ID of the user that has voted, as well as the content of their vote:  1 for upvote, -1 for downvote.
  // A user cannot downvote and upvote a question at the same time.
  if (req.body.requestType === 'addVote') {
    if (!req.body.voteType) {
      const err = new Error();
      err.status = 400;
      err.message = 'Vote Information not provided. Please see documentation';
      return next(err);
    }

    // Convert Vote Type to Number
    req.body.voteType = Number(req.body.voteType);

    if (typeof req.body.voteType  !== 'number' || Math.abs(req.body.voteType) !== 1) {
      const err = new Error();
      err.message = 'Vote type specified is not valid';
      err.status = 400;
      return next(err);
    }

    // Adds upvote
    if (req.body.voteType === 1) {

      return Question.findById(id)
        .then(response => {
          const voteArr = response.votes.list.find(item => item.user === '5b4aba9258793e04e13315a7');
          if (voteArr) {
            const err = new Error();
            err.status = 400;
            err.message = 'User has already voted on this question';
            return next(err);
          }

          return Question.findByIdAndUpdate(id, 
            {$inc: {'votes.score': req.body.voteType}, 
              $push:
            {
              'votes.list':
              {
                user:'5b4aba9258793e04e13315a7',
                type: req.body.voteType
              }
            }
            },
            {new:true})
            .then(response => {
              res.json(response);
            });
        })
        .catch(next); 

    // adds Downvote
    } else if (req.body.voteType === -1) {

      return Question.findById(id)
        .then(response => {
          const voteArr = response.votes.list.find(item => item.user === '5b4aba9258793e04e13315a7');
          if (voteArr) {
            const err = new Error();
            err.status = 400;
            err.message = 'User has already voted on this question';
            return next(err);
          }

          return Question.findByIdAndUpdate(id, 
            {$inc: {'votes.score': req.body.voteType}, 
              $push:
            {
              'votes.list':
              {
                user:'5b4aba9258793e04e13315a7',
                type: req.body.voteType
              }
            }
            },
            {new:true})
            .then(response => {
              res.json(response);
            });
        })
        .catch(next); 



    }
  }

  // Removes user Vote from Array of Votes
  if (req.body.requestType === 'removeVote') {
    return Question.findById(id)
      .then(response => {
        const vote = response.votes.list.find(item => item.user === '5b4aba9258793e04e13315a7');
        if (!vote) {
          const err = new Error();
          err.status = 400;
          err.message = 'User has not voted on this question';
          return next(err);
        }

        return Question.findByIdAndUpdate(id, 
          {$inc: {'votes.score': (vote.type * -1)}, 
            $pull:
            {
              'votes.list':
              {
                user:'5b4aba9258793e04e13315a7'
              }
            }
          },
          {new:true})
          .then(response => {
            res.json(response);
          });
      })
      .catch(next); 
  }
});


//================================== DELETE ROUTE ====================>
router.delete('/questions/:id', (req,res,next) => {
  const {id} = req.params;
  Question.findByIdAndRemove(id)  
    .then(response => {
      res.status(204).end();
    })
    .catch(err => {
      return next(err);
    });

});


module.exports = router;