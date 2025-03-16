// src/routes/blog/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

/**
 * Get a list of blog for the current user, returns an array of blog id
 */
module.exports = async (req, res) => {
  try {
    logger.info('GET /blog - Incoming request to fetch all blogs');

    const blogs = await Blog.byUser(req.user);

    logger.debug({ blogs, ownerId: req.user }, 'GET /blog - Retrieved blogs');
    return res.status(200).json(createSuccessResponse({ blogs }));
  } catch (err) {
    logger.error({ err, ownerId: req.user }, 'GET /blog - Failed to get blogs');
    return res.status(500).json(createErrorResponse(500, 'Unable to retrieve blogs'));
  }
};
