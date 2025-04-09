const { Blog } = require('../../model/blog');
const { createSuccessResponse, createErrorResponse, createDebugLog } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // Extracting query parameters from the request (search keyword and category)
  const { keyword, category } = req.query;

  try {
    logger.info(`GET /blog/search?keyword=...&category=...`);

    // Searching for blogs based on the provided keyword and category
    const blogs = await Blog.search(keyword, category);

    blogs.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sorting blogs by creation date (latest first)


    createDebugLog(`Passed vairables: 
- Keyword: ${keyword}
- Category: ${category}
- Founded Blogs data: ${blogs}
`)

    return res.status(200).json(createSuccessResponse({ blogs: blogs }));
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    const errorMessage = createErrorResponse(status, message)

    logger.error({ errMessage: err.message });

    res.status(status).json(errorMessage);
  }
};
