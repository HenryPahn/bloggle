// src/routes/index.js
const express = require('express');

// author and version from our package.json file
const { authors, version } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Simple health route check, return "ok" status if server is running
router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    authors,
    githubUrl: 'https://github.com/HenryPahn/bloggle',
    version,
  });
});

module.exports = router;
