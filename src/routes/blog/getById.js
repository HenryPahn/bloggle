// src/routes/blog/getById.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    logger.info(`GET /blog/:id - Incoming request to fetch a blog post`);
    const blog = await Blog.byId(ownerId, id);

    // Check if blog is null or undefined
    if (!blog) {
      logger.warn({ ownerId, id }, 'GET /blog/:id - Blog post not found');
      return res.status(404).json(createErrorResponse(404, 'Blog post not found'));
    }

    // Blog Post found
    logger.info({ blog: blog.getData() }, 'GET /blog/:id - Retrieved blog post successfully');
    return res.status(200).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    logger.error({ errMessage: err.message }, 'GET /blog/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error`));
  }
};
