// src/routes/blog/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const ownerId = req.user;
  const { id } = req.params;
  const { title, content, images } = req.body;

  try {
    logger.info(`PUT /blog/:id - Incoming request to update a blog post`);

    const blog = await Blog.byId(ownerId, id);

    // Check if blog is null or undefined
    if (!blog) {
      logger.warn({ ownerId, id }, 'PUT /blog/:id - Blog post not found');
      return res.status(404).json(createErrorResponse(404, 'Blog post not found'));
    }

    logger.info('PUT /blog/:id - Updating blog post');
    // Update blog with new data
    await blog.setData(title, content, images);
    // Save changes
    await blog.save();

    logger.debug({ blog: blog.getData() }, 'PUT /blog/:id - Blog updated successfully');
    return res.status(200).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    if (
      err.message.includes('Owner ID and Blog ID are required') ||
      err.message.includes(`The data isn't changed`)
    ) {
      logger.warn({ ownerId, id, errMessage: err.message }, `PUT /blog/:id - Bad Request`);
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    if (err.message.includes('No blog found with')) {
      logger.warn(
        { ownerId, id, errMessage: err.message },
        `PUT /blog/:id - Blog post not found for the user`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    logger.error({ message: err.message }, 'PUT /blog/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
