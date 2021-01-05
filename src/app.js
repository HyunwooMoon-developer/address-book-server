/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config');
const {v4 : uuid} = require('uuid');
const logger = require('./logger');
const store = require('./store');
const validateBearerToken = require('./validateBearerToken');
const AddressRouter = require('./Adress/AddressRouter');
const errorHandler = require('./errorHandler');


const app = express()
//pipeline begins
//standard middleware
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//route
app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
})

app.use(validateBearerToken);

app.use('/address', AddressRouter);



//error handler
app.use(errorHandler);

module.exports = app