const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Blogger } = require('../../../model/blogger');
const logger = require('../../../logger');

/**
 * Get the visited blogs of the authenticated user
 */
module.exports = async (req, res) => {
  logger.info('GET /visited - Incoming request to get visited blogs');

  try {
    const blogger = await Blogger.byUser(req.user);  // Fetch blogger 

    // Fetch visited blogs using the method from Blogger class
    const visitedBlogs = blogger.getVisitedBlogs();

    // Return the visited blogs as a successful response
    logger.info({ ownerId: req.user }, 'GET /visited - Retrieved visited blogs');
    return res.status(200).json(createSuccessResponse({ visitedBlogs }));

  } catch (err) {
    logger.error({ message: err.message }, 'GET /visited - Error fetching visited blogs');
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
