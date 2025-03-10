// src/routes/blog/search.js

// Functions return successful responses 
const { createSuccessResponse } = require('../../response')

module.exports = async (req, res) => {
  const successResponse = createSuccessResponse({
    // returned data goes here
    
  })

  res.status(200).json(successResponse);
};
