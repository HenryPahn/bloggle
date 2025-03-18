// src/routes/blog/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

/**
 * Delete the user's own blog post with blog id
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const { id } = req.params;

  try {
    logger.info(`DELETE /blog/:id - Incoming request to delete a blog post`);

    await Blog.delete(ownerId, id);

    logger.info({ ownerId, removeBid: id }, 'DELETE /blog/:id - Deleted blog post successfully.');
    return res
      .status(200)
      .json(createSuccessResponse({ message: 'Blog post deleted successfully' }));
  } catch (err) {
    if (err.message.includes('Owner ID and Blog ID are required')) {
      logger.warn(
        { ownerId, removeBid: id, errMessage: err.message },
        `DELETE /blog/:id - Missing required fields`
      );
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    if (err.message.includes('No blog found for owner')) {
      logger.warn(
        { ownerId, removeBid: id, errMessage: err.message },
        `DELETE /blog/:id - Blog not found`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    logger.error({ errMessage: err.message }, 'DELETE /blog/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
