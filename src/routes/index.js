// src/routes/index.js

const express = require('express');

// author and version from our package.json file
const { authors, version } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Blog routes
router.use(`/blog`, require('./blog'));

// Blogger routes
router.use(`/blogger`, require('./blogger'));

// a simple health check route
router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    authors,
    version,
  });
});

module.exports = router;
