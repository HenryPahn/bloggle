// src/routes/blog/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');
const upload = require('../../middleware/upload');

/**
 * Create a new blog for the current user
 */
module.exports = async (req, res) => {
  logger.info('POST /blog - Incoming request to create a new blog post');

  upload.array('images')(req, res, async () => {
    const ownerId = req.user;
    const { title, content } = req.body;

    let images = [];
    images = req.files
      ? req.files.map((file) => ({
          originalname: file.originalname,
          buffer: file.buffer,
        }))
      : [];
    const skippedFiles = req.skippedFiles || 0;

    let uploadFileMessage = 'No files were selected.';
    if (images.length > 0) {
      uploadFileMessage = `${images.length} image(s) uploaded successfully`;
      if (skippedFiles > 0) {
        uploadFileMessage += `, but ${skippedFiles} file(s) were skipped due to invalid type.`;
      }
    } else if (skippedFiles > 0) {
      uploadFileMessage = `All ${skippedFiles} file(s) were skipped due to invalid type.`;
    }

    // Validate input (TODO: Author)
    if (!title && !content && (!images || images.length === 0)) {
      logger.warn(
        { title, content, images },
        'POST /blog - At least one of title, content or images is required'
      );
      return res
        .status(400)
        .json(createErrorResponse(400, 'At least one of title, content or images is required'));
    }

    try {
      // Create and save blog post (TODO: Author)
      const blogParameter = {
        ownerId,
        title,
        content,
        images,
      };
      const blog = new Blog(blogParameter);
      await blog.setData(title, content, images);
      await blog.save();

      logger.debug(
        { uploadFileMessage, blog: blog.getData() },
        'POST /blog - Blog post created successfully'
      );
      return res.status(201).json(
        createSuccessResponse({
          message: 'Blog post created successfully',
          uploadFileMessage,
          blog: blog.getData(),
        })
      );
    } catch (err) {
      logger.error({ message: err.message }, 'POST /blog - Internal Server Error');
      return res.status(500).json(createErrorResponse(500, `Internal Server Error ${err.message}`));
    }
  });
};
