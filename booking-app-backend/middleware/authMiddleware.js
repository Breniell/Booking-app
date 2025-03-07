const jwt = require('jsonwebtoken'); // Ajouter cette ligne manquante en haut
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error('Erreur JWT:', error.message);
    return res.status(401).json({ message: 'Token invalide' });
  }
};






























// const jwt = require('jsonwebtoken'); // Ajouter cette ligne manquante en haut
// require('dotenv').config();

// exports.authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     // Ajouter après avoir décodé le token
// req.user = {
//   id: decodedToken.id,
//   email: decodedToken.email,
//   role: decodedToken.role
// };
//     next();
//   } catch (error) {
//     console.error('JWT Error:', error.message);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };