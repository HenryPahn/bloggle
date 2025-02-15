// src/routes/api/index.js

const express = require('express');
const router = express.Router();

// GET /api/tests
router.get('/tests', require('./get'));

// Other routes (POST, DELETE, etc.) will go here later on...

module.exports = router;






 