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
