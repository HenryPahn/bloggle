// src/routes/blog/index.js

const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

/* CRUD Routes */
// POST /blog -> Create a new blog post
router.post(`/`, require('./post'));

// PUT /blog/:id -> Update the user's own existing blog post with blog id
router.put(`/:id`, require('./put'))

// GET /blog -> Retrieve all blog posts for the current user
router.get(`/`, require('./get'));

// GET /blog/:id -> Retrieve a single blog post with id, returns blog post details
router.get(`/:id`, require('./getById'));

// DELETE /blog/:id -> Delete the user's own blog post with blog id
router.delete(`/:id`, require('./delete'));

// -----------------------------------------
// Other routes (POST, DELETE, etc.) for favourite blogs will go here later on...

//  GET /blog/search
router.get(`/search`, require('./search'));

// Other routes (POST, DELETE, etc.) for visited blogs will go here later on...

module.exports = router;
