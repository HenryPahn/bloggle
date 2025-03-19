// src/routes/blogger/index.js

const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

/* Favorite Functionality Routes */
// GET /blogger/favorite -> Retrieve the user’s list of favorite blog posts
router.get(`/favorite`, require('./favoriteBlogs/get'));

// PUT /blogger/favorite/:id -> Add a blog post to the user’s favorites list
router.put(`/favorite/:id`, require('./favoriteBlogs/put'));

// DELETE /blogger/favorite/:id -> Remove a blog post from the user’s favorites list
router.delete(`/favorite/:id`, require('./favoriteBlogs/delete'));

// -----------------------------------------
/* Visited Functionality Routes */
//  GET /blogger/visited
router.get(`/visited`, require('./visitedBlogs/get'));

//  POST /blogger/visited/:id
router.post(`/visited/:blogId`, require('./visitedBlogs/post'));

//  DELETE /blogger/visited/:id
router.delete(`/visited/:blogId`, require('./visitedBlogs/delete'));

// -----------------------------------------
module.exports = router;
