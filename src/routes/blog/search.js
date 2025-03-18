const { Blog } = require('../../model/blog');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // Extracting query parameters from the request (search keyword and category)
  const { keyword, category } = req.query;

  try {
    // Checking if the keyword is not provided
    if (!keyword) { 
      logger.error({ errMessage: 'Keyword must be provided' }, 'GET /blog/search - Bad Request');
      return res.status(400).json(createErrorResponse(400, 'Keyword must be provided'));
    }

    // Searching for blogs based on the provided keyword and category
    const blogs = await Blog.search(keyword, category);

    blogs.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sorting blogs by creation date (latest first)
      
    logger.info({ blogsCount: blogs.length }, 'GET /blog/search - Blogs retrieved successfully');
    return res.status(200).json(createSuccessResponse({ blogs: blogs }));
  } catch (error) {
    logger.error({ errMessage: error.message }, 'GET /blog/search - Error searching blog');
    return res.status(500).json(createErrorResponse(500, 'Interval Server Error'));
  }
};
