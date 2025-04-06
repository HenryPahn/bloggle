// src/routes/blog/getById.js

const { createSuccessResponse, createErrorResponse, createDebugLog } = require('../../response');
const { Blog } = require('../../model/blog');
const { Blogger } = require('../../model/blogger');
const logger = require('../../logger');

/**
 * Retrieve a single blog post with id, returns blog post details
 */
module.exports = async (req, res) => {
  const { ownerId, blogId } = req.params;

  try {
    logger.info(`GET /blogger/:ownerId/:id`);

    // check if any Blogger with the provided ownerId exists
    await Blogger.byUser(ownerId);

    const blog = await Blog.byId(ownerId, blogId);

    createDebugLog(`Retrieved the blog data successfully: 
- ownerId: ${ownerId}
- blogId: ${blogId}
- Retrieved Blog data: ${blog}`)

    return res.status(200).json(createSuccessResponse({ blog: blog.getData() }));
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    const errorMessage = createErrorResponse(status, message)

    logger.error({ errMessage: err.message });

    res.status(status).json(errorMessage);
  }
};
