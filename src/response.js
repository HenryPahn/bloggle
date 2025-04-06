// src/response.js

// Success reponse format
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    ...data
  };
};

// Error response format
module.exports.createErrorResponse = function (code, message) {
  return {
    status: "error",
    error: {
      code: code,
      message: message
    }
  }
};

const logger = require("./logger")

// add a debug message to logger
module.exports.createDebugLog = function (message) {
  // Check if the current npm script is 'dev' or 'debug'
  const isDebugging = process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'debug';

  // if user is debugging, print all environment variables to check if any is missing	  
  if (isDebugging) {
    logger.debug(message)
  }
}
