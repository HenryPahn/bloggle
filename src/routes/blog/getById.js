// src/routes/blog/getById.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

/**
 * Retrieve a single blog post with id, returns blog post details
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const { id } = req.params;

  try {
    logger.info(`GET /blog/:id - Incoming request to fetch a blog post`);
    const blog = await Blog.byId(ownerId, id);

    // Check if blog is null or undefined
    if (!blog) {
      logger.warn({ ownerId, id }, 'GET /blog/:id - Blog post not found for the user');
      return res.status(404).json(createErrorResponse(404, 'Blog post not found'));
    }

    // Blog Post found
    logger.debug({ blog: blog.getData() }, 'GET /blog/:id - Retrieved blog post successfully');
    return res.status(200).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    if (err.message.includes('Owner ID and Blog ID are required')) {
      logger.warn(
        { ownerId, id, errMessage: err.message },
        `GET /blog/:id - Missing required fields`
      );
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    if (err.message.includes('No blog found with')) {
      logger.warn(
        { ownerId, id, errMessage: err.message },
        `GET /blog/:id - Blog post not found for the user`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    logger.error({ errMessage: err.message }, 'GET /blog/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
