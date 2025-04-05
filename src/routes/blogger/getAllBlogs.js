// src/routes/blog/get.js

const { createSuccessResponse, createErrorResponse, createDebugLog } = require('../../response');
const { Blog } = require('../../model/blog');
const { Blogger } = require('../../model/blogger');
const logger = require('../../logger');

/**
 * Get a list of blog for the current user, returns an array of blog id
 */
module.exports = async (req, res) => {
  const { ownerId } = req.params;

  try {
    logger.info('GET /blogger/:ownerId/blogs');
    
    // check if any Blogger with the provided ownerId exists
    await Blogger.byUser(ownerId);

    const blogs = await Blog.byUser(ownerId);

    createDebugLog(`Retrieved blog ids successfully: 
- ownerId: ${ownerId}
- Retrieved Blog Ids: ${ blogs }`)

    return res.status(200).json(createSuccessResponse({ blogs: blogs }));
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    const errorMessage = createErrorResponse(status, message)

    logger.error({ errMessage: err.message });

    res.status(status).json(errorMessage);
  }
};
