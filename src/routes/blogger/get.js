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

  logger.info('GET /blogger/:ownerId');
  let blogger;

  // retrieve blogger
  try {
    blogger = await Blogger.byUser(ownerId);
  } catch (err) {
    blogger = new Blogger({ ownerId: ownerId });
    await blogger.save();
  }

  createDebugLog(`Retrieved blog ids successfully: 
- ownerId: ${ownerId}
- Retrieved Blogger Data: ${blogger.getData()}`)

  return res.status(200).json(createSuccessResponse({ blogger: blogger.getData() }));
};
