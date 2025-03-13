// src/routes/blog/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

/**
 * Create a new blog for the current user
 */
module.exports = async (req, res) => {
  logger.info('POST /blog - Incoming request to create a new blog');

  try {
    // ownerId
    const hashedEmail = req.user;
    // TO DO: Add author into blog parameter
    const { title, content, images } = req.body;

    // Validate request body
    if (
      !title ||
      !content //|| !author
    ) {
      logger.warn('POST /blog - Missing required fields in request body');
      return res
        .status(400)
        .json(createErrorResponse(400, 'Title, content, and author are required'));
    }

    // Create a new blog instance
    const blogParameter = {
      ownerId: hashedEmail,
      // author,
      title,
      content,
      images,
    };
    const blog = new Blog(blogParameter);
    await blog.save();

    logger.info(
      { blogId: blog.id, ownerId: hashedEmail },
      'POST /blog - Blog created successfully'
    );
    return res.status(201).json(createSuccessResponse({ blog }));
  } catch (err) {
    logger.error({ message: err.message }, 'POST /blog - Error creating a blog');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error`));
  }
};
