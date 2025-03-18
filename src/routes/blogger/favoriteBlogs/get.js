// src/routes/blogger/get.js

const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Retrieve the user’s list of favorite blog posts.
 */
module.exports = async (req, res) => {
  try {
    logger.info(`GET /blogger/favorite - Incoming request to fetch user's favorite blog post list`);

    const ownerId = req.user;
    const blogger = await Blogger.byUser(ownerId);
    const favorites = blogger.getFavouriteBlogs();

    logger.debug(
      { favorites, ownerId: req.user },
      'GET /blogger/favorite - Retrieved favorite blog post list'
    );
    return res.status(200).json(createSuccessResponse({ favorites }));
  } catch (err) {
    logger.error({ err }, 'GET /blogger/favorite - Error retrieving favorite blogs:');
    return res.status(500).json(createErrorResponse(500, 'Failed to retrieve favorite blogs'));
  }
};
