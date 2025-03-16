// src/routes/blog/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    logger.info(`PUT /blog/:id - Incoming request to update a blog post`);

    const ownerId = req.user;
    const { id } = req.params;
    // Extracting update info from req.body
    const { title, content, images } = req.body;

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

    logger.info({ blog: blog.getData() }, 'PUT /blog/:id - Blog updated successfully');
    return res.status(200).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    if (err.message.includes(`The data isn't changed`)) {
      logger.warn(
        { message: err.message },
        `PUT /blog/:id - The data isn't changed, there is no input`
      );
      return res
        .status(400)
        .json(createErrorResponse(400, `The data isn't changed, there is no input`));
    }
    logger.error({ message: err.message }, 'PUT /blog/:id - Error updating blog post');
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
