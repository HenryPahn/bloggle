// src/routes/index.js

const express = require('express');
const { authors, version } = require('../../package.json');
const { createSuccessResponse } = require('../response')

// Create a router that we can use to mount our API
const router = express.Router();

router.use('/api', require('./api'));

// Simple health route check, return "ok" status if server is running
router.get('/', (req, res) => {
  const data = {
    authors, 
    githubUrl: 'https://github.com/HenryPahn/bloggle',
    version,
  }

  // create a success response
  const successResponse = createSuccessResponse({
    ...data
  })

  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json(successResponse);
});

module.exports = router;
