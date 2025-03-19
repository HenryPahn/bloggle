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
    const ownerId = req.user;
    // TO DO: Add author into blog parameter
    const { title, content, images } = req.body;

    // Validate request body (TODO: !Author)
    if (!title && !content && (!images || images.length === 0)) {
      logger.warn(
        { title, content, images },
        'POST /blog - At least one of title, content or images is required'
      );
      return res
        .status(400)
        .json(createErrorResponse(400, 'At least one of title, content or images is required'));
    }

    // Create a new blog instance and save to database
    const blogParameter = {
      ownerId,
      // author,
      title,
      content,
      images,
    };
    const blog = new Blog(blogParameter);
    await blog.save();

    logger.debug({ blog: blog.getData() }, 'POST /blog - Blog created successfully');
    return res.status(201).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    logger.error({ message: err.message }, 'POST /blog - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error ${err.message}`));
  }
};
