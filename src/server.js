// src/server.js
const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');

// Get PORT from .env file and default port is `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server is running on port ${port}`);
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
