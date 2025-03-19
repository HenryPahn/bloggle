const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

/**
 * DELETE /visited/:blogId - Remove a blog ID from the user's visited blogs list
 */
module.exports = async (req, res) => {
  logger.info('DELETE /visited - Incoming request to remove a blog from visited blogs list');

  try {
    const { blogId } = req.params;  
    // Fetch the existing blogger instance by the ownerId 
    const blogger = await Blogger.byUser(req.user);

    // delete the blogId from the visited blogs list
    await blogger.deleteVisitedBlog(blogId);  // This will throw an error if blogId is not found

    // Save the updated blogger instance
    await blogger.save();

    logger.info({ ownerId: req.user, blogId }, 'DELETE /visited - Blog removed from visited list');
    return res.status(200).json(createSuccessResponse({ message: 'Blog removed from visited list successfully' }));
  } catch (err) {
    logger.error(`DELETE /visited - Failed to remove blog: ${err.message}`);
    return res.status(400).json(createErrorResponse(400, err.message));
  }
};
