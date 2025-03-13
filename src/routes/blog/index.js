// src/routes/blog/index.js

const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

/* CRUD Routes */
// POST /blogger/ -> Create a new blog post
router.post(`/`, require('./post'));

// GET /blogger/ -> Retrieve all blog posts
router.get(`/`, require('./get'));

// -----------------------------------------
// Other routes (POST, DELETE, etc.) for favourite blogs will go here later on...

//  GET /blog/search
router.get(`/search`, require('./search'));

// Other routes (POST, DELETE, etc.) for visited blogs will go here later on...

module.exports = router;
