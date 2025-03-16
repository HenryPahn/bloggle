// src/app.js


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Ensures req.body is parsed as JSON before the route handling
app.use(express.json());

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

const passport = require('passport');
const authenticate = require('./auth');

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Set up our passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());


// all routes of ServerAPI goes to routes dir 
app.use('/', require('./routes'));

// import function to create JSON reponse
const { createErrorResponse } = require('./response')

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  const status = 404;
  const message = 'not found';

  const errorMessage = createErrorResponse(status, message)

  res.status(404).json(errorMessage);
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  const errorMessage = createErrorResponse(status, message)

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json(errorMessage);
});

// Export app, and use it in server.js
module.exports = app;
