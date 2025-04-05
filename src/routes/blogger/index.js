// src/routes/blogger/index.js

const express = require('express');

// authentication middleware
const { authenticate } = require('../../auth');

// Create a router on which to mount our API endpoints
const router = express.Router();

/* Blogger Data Routes */
// GET /blogger/:ownerId -> Retrieve a Blogger data
router.get(`/:ownerId`, require('./get'));

// GET /blogger/:ownerId/blogs -> Retrive a list of all blog of current blogger.
router.get(`/:ownerId/blogs`, require('./getAllBlogs'))

// GET /blogger/:ownerId/:id -> Retrive a blog data of a blogger.
router.get(`/:ownerId/:blogId`, require('./getBlog'))



/* Favorite Functionality Routes */
// GET /blogger/favorite -> Retrieve the user’s list of favorite blog posts
router.get(`/favorite`, authenticate(), require('./favoriteBlogs/get'));

// PUT /blogger/favorite/:id -> Add a blog post to the user’s favorites list
router.put(`/favorite/:id`, authenticate(), require('./favoriteBlogs/put'));

// DELETE /blogger/favorite/:id -> Remove a blog post from the user’s favorites list
router.delete(`/favorite/:id`, authenticate(), require('./favoriteBlogs/delete'));

// -----------------------------------------
/* Visited Functionality Routes */
//  GET /blogger/visited
router.get(`/visited`, authenticate(), require('./visitedBlogs/get'));

//  POST /blogger/visited/:id
router.post(`/visited/:blogId`, authenticate(), require('./visitedBlogs/post'));

//  DELETE /blogger/visited/:id
router.delete(`/visited/:blogId`, authenticate(), require('./visitedBlogs/delete'));

// -----------------------------------------
module.exports = router;
