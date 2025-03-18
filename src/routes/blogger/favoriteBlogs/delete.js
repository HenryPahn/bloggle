// src/routes/blogger/favoriteBlogs/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Remove a blog post from the user’s favorites list
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const blogId = req.params.id;

  try {
    logger.info(
      `DELETE /blogger/favorite/:id - Incoming request to remove a blog post from the user's favorites list`
    );

    // If error occurs, the blogger class will throw
    const blogger = await Blogger.byUser(ownerId);
    const favorites = blogger.getFavoriteBlogs();
    logger.debug(
      { ownerId, favorites },
      `DELETE /blogger/favorite/:id - The user's favorites list before removal`
    );

    await blogger.deleteFavoriteBlog(blogId);
    await blogger.save();
    const favoritesUpdated = blogger.getFavoriteBlogs();

    logger.debug(
      { ownerId, removeBid: blogId, UpdatedFavorites: favoritesUpdated },
      'DELETE /blogger/favorite/:id - Blog post removed from favorites successfully'
    );
    return res.status(200).json(createSuccessResponse({ favorites: favoritesUpdated }));
  } catch (err) {
    if (
      // Missing required fields
      err.message.includes('Owner ID is required') ||
      err.message.includes('Blog ID is required')
    ) {
      logger.warn(
        { ownerId, removeBid: blogId, errMessage: err.message },
        `DELETE /blogger/favorite/:id - Missing required fields`
      );
      return res.status(400).json(createErrorResponse(400, err.message));
    }

    // Resource not found
    if (
      err.message.includes('No blogger found with ownerId') ||
      err.message.includes(`Blog doesn't exist in favorite list`)
    ) {
      logger.warn(
        { ownerId, removeBid: blogId, errMessage: err.message },
        `DELETE /blogger/favorite/:id - Blog/Blogger not found`
      );
      return res.status(404).json(createErrorResponse(404, err.message));
    }

    // Unexpected server errors
    logger.error(
      { errMessage: err.message },
      'DELETE /blogger/favorite/:id - Internal Server Error'
    );
    return res.status(500).json(createErrorResponse(500, `Internal Server Error: ${err.message}`));
  }
};
