const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models'); // Import des modèles en CommonJS
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const expertRoutes = require('./routes/expertRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const flutterwaveRoutes = require('./routes/flutterwaveRoutes');
const videoConferenceRoutes = require('./routes/videoConferenceRoutes');
const expertStatsRoutes = require('./routes/expertStatsRoutes');
const orangeMoneyRoutes = require('./routes/orangeMoneyRoutes');
const mtnMomoRoutes = require('./routes/mtnMomoRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const reviewRoutes = require('./routes/reviewRoutes');

// Charger le fichier d'environnement approprié
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

// Utiliser PORT depuis l'environnement, sinon fallback sur 5000
const port = process.env.PORT || 5000;
console.log(`🔍 Trying to start server on port: ${port}`);

// Créer l'instance Express
const app = express();

// Activer les logs détaillés
app.use(morgan('dev'));

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://booking-app-kappa-nine.vercel.app'], // Autorisez les deux origines
  credentials: true
}));

// Middleware de sécurité et limitation des requêtes

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  // autres configurations
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Parsers pour JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques avec des en-têtes CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: function (res, filePath) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Origin', 'https://booking-app-kappa-nine.vercel.app'); // Autorisez cette origine également
  }
}));

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: function (res, filePath) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Origin', 'https://booking-app-kappa-nine.vercel.app'); // Autorisez cette origine également
  }
}));

// Définition des routes
app.use('/api/users', userRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments/flutterwave', flutterwaveRoutes);
app.use('/api/payments/orange-money', orangeMoneyRoutes);
app.use('/api/payments/mtn-momo', mtnMomoRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/video', videoConferenceRoutes);
app.use('/api/expert-stats', expertStatsRoutes);
app.use('/api/services', reviewRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('Booking App Backend is running!');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Synchronisation de la base de données et démarrage du serveur
db.sequelize.sync({ alter: true })
  .then(() => {
    logger.info('Database synced with alter');
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${port}`);
    });
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    logger.error('Error syncing database:', err);
    console.error('❌ Error syncing database:', err);
    process.exit(1);
  });


// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
