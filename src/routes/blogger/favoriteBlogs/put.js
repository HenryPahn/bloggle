// src/routes/blogger/favoriteBlogs/put.js

const { createSuccessResponse, createErrorResponse } = require('../../..//response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Add a blog post to the user’s favorites list
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const blogId = req.params.id;

  try {
    logger.info(
      `PUT /blogger/favorite/:id - Incoming request to Add a blog post to the user's favorites list`
    );

    const blogger = await Blogger.byUser(ownerId);
    const favorites = blogger.getFavoriteBlogs();
    logger.debug(
      { ownerId, favorites },
      `PUT /blogger/favorite/:id - The user's favorites list before update`
    );

    await blogger.addFavoriteBlog(blogId);
    await blogger.save();
    const favoritesUpdated = blogger.getFavoriteBlogs();

    logger.debug(
      { ownerId, addBid: blogId, UpdatedFavorites: favoritesUpdated },
      'PUT /blogger/favorite/:id - Blog post added to favorites successfully'
    );
    return res.status(200).json(createSuccessResponse({ favorites: favoritesUpdated }));
  } catch (err) {
    if (
      err.message.includes('Owner ID is required') ||
      err.message.includes('Blog ID is required') ||
      err.message.includes('Blog is already added to favorite list')
    ) {
      logger.warn(
        { ownerId, addBid: blogId, errMessage: err.message },
        `PUT /blogger/favorite/:id - Bad Request: Missing required fields/Blog already in favorites`
      );
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    if (err.message.includes('No blogger found with ownerId')) {
      logger.warn(
        { ownerId, addBid: blogId, errMessage: err.message },
        `PUT /blogger/favorite/:id - Blogger not found`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    logger.error({ errMessage: err.message }, 'PUT /blogger/favorite/:id - Internal Server Error');
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
