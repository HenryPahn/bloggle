// src/routes/blog/search.js

// Functions return successful responses 
const {Blog} = require('../../model/blog');
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // Extracting query parameters from the request (search keyword and category)
  const {keyword, category} = req.query;

  try{
    // Checking if the keyword is not provided
    if(!keyword){ 
      return res.status(200).json(createSuccessResponse({message:'Keyword must be provided'}));
    }
    // Searching for blogs based on the provided keyword and category
    const blogs = await Blog.search(keyword,category);

    if(blogs.length > 0){ // If blogs are found
      blogs.sort((a,b) => new Date(b.created) - new Date(a.created)); // Sorting blogs by their creation date in descending order
      res.status(200).json(createSuccessResponse({blogs:blogs}));
    } else {
      return res.status(200).json(createSuccessResponse({message:'No matching blogs found'}));
    }
    } catch (error) {
      logger.error('Error occured in search API:', error);
      return res.status(200).json(createSuccessResponse({message:'An error occured while searching blogs'}));
    }
  };

