// src/routes/blog/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Blog } = require('../../model/blog');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    logger.info(`DELETE /blog/:id - Incoming request to delete a blog post`);
    const deleted = await Blog.delete(ownerId, id);

    if (deleted) {
      logger.info({ ownerId, id }, 'DELETE /blog/:id - Deleted blog post successfully.');
      return res
        .status(200)
        .json(createSuccessResponse({ message: 'Blog post deleted successfully' }));
    }

    logger.warn({ ownerId, id }, 'DELETE /blog/:id - Blog post not found');
    return res.status(404).json(createErrorResponse(404, 'Fail to delete: Blog post not found'));
  } catch (err) {
    logger.error({ errMessage: err.message }, 'DELETE /blog/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
