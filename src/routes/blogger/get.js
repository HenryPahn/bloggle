// src/routes/blog/get.js

const { createSuccessResponse, createDebugLog } = require('../../response');
const { Blogger } = require('../../model/blogger');
const logger = require('../../logger');

/**
 * Get a list of blog for the current user, returns an array of blog id
 */
module.exports = async (req, res) => {
  const ownerId = req.user;

  logger.info('GET /blogger/');
  let blogger;
  
  let status = 200;

  // retrieve blogger
  try {
    blogger = await Blogger.byUser(ownerId);
  } catch (err) {
    logger.info({err: err}, "Create a new Blogger")
    blogger = new Blogger({ ownerId: ownerId });
    await blogger.save();

    status = 201;
  }

  createDebugLog(`Retrieved blog ids successfully: 
- ownerId: ${ownerId}
- Retrieved Blogger Data: ${blogger.getData()}`)

  return res.status(status).json(createSuccessResponse({ blogger: blogger.getData() }));
};
