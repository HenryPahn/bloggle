// src/server.js
const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');

// Get PORT from .env file and default port is `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Check if the current npm script is 'dev' or 'debug'
    const isDebugging = process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'debug';

    // if user is debugging, print all environment variables to check if any is missing	  
    if (isDebugging) {
      logger.debug(`Environment Variables: 
- LOG_LEVEL: ${process.env.LOG_LEVEL}
- PORT: ${process.env.PORT}`);
    }

    // Log a message that the server has started, and which port it's using.
    logger.info(`Server is running on port ${port}`);
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
