'use strict';
//================================== Import Dependencies ====================>

const express = require('express');
const morgan = require('morgan');
const app = express();
const {PORT} = require('./config');
const mongoose = require('mongoose');
const questionRoute = require('./routes/questions.routes');

//================================== Logger Middleware ====================>
app.use(morgan('common'));

//================================== JSON Parser ====================>
app.use(express.json());


//================================== Routes ====================>
app.use('/api', questionRoute);


//================================== Error Handler ====================>
app.use((err,req,res,next) => {
  console.log(err);
  const error = new Error();
  error.status = err.status || 500;
  error.message = err.message || 'Internal Server Error';
  res.status(err.status).json(error);
});


mongoose.connect('mongodb://localhost:27017/pregunta',{useNewUrlParser: true}, () => {
  console.log('DB Connected');
});


app.listen(PORT, err => {
  if (err) {
    return console.log(err);
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});