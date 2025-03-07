// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {

  console.error(err.stack);
  
  const response = {
    success: false,
    message: err.message || 'Erreur serveur',
    code: err.code || 500,
    errors: err.errors
  };

  res.status(err.statusCode || 500).json(response);

  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.originalUrl, method: req.method });
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ message: 'Something went wrong!', error: err.message }); //Send a generic error message to the client (avoid exposing sensitive information)
};

module.exports = errorHandler;
