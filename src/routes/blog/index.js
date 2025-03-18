// src/routes/blog/index.js

const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// authentication middleware
const { authenticate } = require('../../auth');

/* CRUD Routes */
// POST /blog -> Create a new blog post
router.post(`/`, authenticate(), require('./post'));

// PUT /blog/:id -> Update the user's own existing blog post with blog id
router.put(`/:id`, authenticate(), require('./put'));

// GET /blog -> Retrieve all blog posts for the current user
router.get(`/`, authenticate(), require('./get'));

// GET /blog/:id -> Retrieve a single blog post with id, returns blog post details
router.get(`/:id`, authenticate(), require('./getById'));

// DELETE /blog/:id -> Delete the user's own blog post with blog id
router.delete(`/:id`, authenticate(), require('./delete'));

// -----------------------------------------
/* Search Functionality Routes */
//  GET /blog/search
router.get(`/search`, require('./search'));

// -----------------------------------------
module.exports = router;
