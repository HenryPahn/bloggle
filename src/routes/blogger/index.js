// src/routes/blogger/index.js

const express = require('express');
 
// Create a router on which to mount our API endpoints
const router = express.Router();

// GET /blogger/favorite
router.get(`/favorite`, require('./favoriteBlogs/get')); 

// Other routes (POST, DELETE, etc.) for favourite blogs will go here later on...



// Other routes (POST, DELETE, etc.) for visited blogs will go here later on...
//  GET /blogger/visited
router.get(`/visited`, require('./visitedBlogs/get')); 

// POST /blogger/visited/:blogId 
router.post('/visited/:blogId', require('./visitedBlogs/post'));

//DELETE /blogger/visited/:blogId
router.delete('/visited/:blogId', require('./visitedBlogs/delete'));




module.exports = router;

