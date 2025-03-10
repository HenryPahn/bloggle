// src/routes/blog/index.js

const express = require('express');
 
// Create a router on which to mount our API endpoints
const router = express.Router();

// GET /blogger/
router.get(`/`, require('./get')); 

// Other routes (POST, DELETE, etc.) for favourite blogs will go here later on...

//  GET /blog/search
router.get(`/search`, require('./search')); 

// Other routes (POST, DELETE, etc.) for visited blogs will go here later on...

module.exports = router;

