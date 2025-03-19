// src/routes/blogger/favoriteBlogs/get.js

const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Retrieve the user’s list of favorite blog posts.
 */
module.exports = async (req, res) => {
  const ownerId = req.user;

  try {
    logger.info(`GET /blogger/favorite - Incoming request to fetch user's favorite blog post list`);

    const blogger = await Blogger.byUser(ownerId);
    const favorites = blogger.getFavouriteBlogs();

    logger.debug(
      { ownerId, favorites },
      'GET /blogger/favorite - Retrieved favorite blog post list'
    );
    return res.status(200).json(createSuccessResponse({ favorites }));
  } catch (err) {
    if (err.message.includes('Owner ID is required')) {
      logger.warn(
        { ownerId, errMessage: err.message },
        `GET /blogger/favorite - Missing required fields`
      );
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    if (err.message.includes('No blogger found with ownerId')) {
      logger.warn(
        { ownerId, errMessage: err.message },
        `GET /blogger/favorite - Blogger not found`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    logger.error({ errMessage: err.message }, `GET /blogger/favorite - Internal Server Error`);
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
