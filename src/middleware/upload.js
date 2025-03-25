const logger = require('../logger');
const multer = require('multer');

// Configure multer for image uploads (store in memory as buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  // Limit file size to 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!req.skippedFiles) req.skippedFiles = 0;
    if (!file.mimetype.startsWith('image/')) {
      logger.warn({ filename: file.originalname }, 'Skipping invalid file (not an image)');
      // Track skipped files
      req.skippedFiles += 1;
      return cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = upload;
