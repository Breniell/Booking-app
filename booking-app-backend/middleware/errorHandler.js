// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log via un utilitaire centralisé
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.originalUrl, method: req.method });
  console.error(err.stack);
  // Envoyer une unique réponse
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    code: err.code || 500,
    errors: err.errors || []
  });
};

module.exports = errorHandler;
