const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Add a blog ID to the authenticated user's visited blogs list
 */
module.exports = async (req, res) => {
  logger.info('POST /visited - Incoming request to add a visited blog');

  try {
    const { blogId } = req.params;  // Get the blogId from the URL parameters

    let blogger;
    try {
      // Fetch the existing blogger instance
      blogger = await Blogger.byUser(req.user);
    } catch (error) {
      logger.warn(`POST /visited - No Blogger found for user: ${req.user}, creating new instance.`);
      
      // Create a new Blogger instance if one doesn't exist
      blogger = new Blogger({ ownerId: req.user });
    }

    // Add the blog to visitedBlogs (will throw an error if blogId is invalid or already in the list)
    await blogger.addVisitedBlog(blogId);

    // Save the updated Blogger instance
    await blogger.save();

    logger.info({ ownerId: req.user, blogId }, 'POST /visited - Blog added to visited list');
    return res.status(200).json(createSuccessResponse({ message: 'Blog added to visited list successfully' }));
  } catch (err) {
    logger.warn(`POST /visited - Failed to add blog: ${err.message}`);
    return res.status(400).json(createErrorResponse(400, err.message));
  }
};
