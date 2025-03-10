// src/routes/blog/get.js

// Functions return successful responses 
//const { createSuccessResponse } = require('../../response')

module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  res.status(200).json({
    status: 'ok',
    // TODO: change me
    blogs: [],
  });
};
