// src/routes/blog/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

/**
 * Get a list of blog for the current user, returns an array of blog id
 */
module.exports = async (req, res) => {
  const ownerId = req.user;

  try {
    logger.info('GET /blog - Incoming request to fetch all blog posts of the current user');

    const blogs = await Blog.byUser(ownerId);
    logger.debug({ ownerId, blogs }, 'GET /blog - Retrieved blog posts');

    if (!blogs.length) {
      const message = `The user hasn't created any blog posts yet`;
      logger.debug({ ownerId }, `GET /blog - ${message}`);
      return res.status(200).json(createSuccessResponse({ blogs, message }));
    }

    return res.status(200).json(createSuccessResponse({ blogs }));
  } catch (err) {
    if (err.message.includes('Owner ID is required')) {
      logger.warn({ ownerId, errMessage: err.message }, `GET /blog - Missing required fields`);
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    logger.error({ ownerId, errMessage: err.message }, 'GET /blog - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
