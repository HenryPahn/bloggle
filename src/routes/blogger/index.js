// src/routes/blogger/index.js

const express = require('express');
 
// Create a router on which to mount our API endpoints
const router = express.Router();

// GET /blogger/favorite
router.get(`/favorite`, require('./favoriteBlogs/get')); 

// Other routes (POST, DELETE, etc.) for favourite blogs will go here later on...

//  GET /blogger/visited
router.get(`/visited`, require('./visitedBlogs/get')); 

// Other routes (POST, DELETE, etc.) for visited blogs will go here later on...

module.exports = router;

