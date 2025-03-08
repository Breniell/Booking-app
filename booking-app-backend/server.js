const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./models'); // Import des modèles en CommonJS
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const expertRoutes = require('./routes/expertRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const flutterwaveRoutes = require('./routes/flutterwaveRoutes');
const videoConferenceRoutes = require('./routes/videoConferenceRoutes');
const expertStatsRoutes = require('./routes/expertStatsRoutes'); // Pensez à vérifier le chemin de montage
const orangeMoneyRoutes = require('./routes/orangeMoneyRoutes');
const mtnMomoRoutes = require('./routes/mtnMomoRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

dotenv.config();

// Utiliser PORT depuis l'environnement, sinon fallback sur 5000
const port = parseInt(process.env.PORT, 10) || 5000;
console.log(`🔍 Trying to start server on port: ${port}`);

// Créer l'instance Express
const app = express();

// Activer les logs détaillés
app.use(morgan('dev'));

// Middleware CORS (ici ouvert à tous)
app.use(cors());

// Middleware de sécurité et limitation des requêtes
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite chaque IP à 100 requêtes par fenêtre
}));

// Parsers pour JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Définition des routes
app.use('/api/users', userRoutes);
app.use('/api/experts', expertRoutes);
// Si expertStatsRoutes doit être accessible sur un chemin différent, par exemple :
app.use('/api/expert-stats', expertStatsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments/flutterwave', flutterwaveRoutes);
app.use('/api/payments/orange-money', orangeMoneyRoutes);
app.use('/api/payments/mtn-momo', mtnMomoRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/video', videoConferenceRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('Booking App Backend is running!');
});

// Middleware de gestion des erreurs (après toutes les routes)
app.use(errorHandler);

// Synchronisation de la base de données et démarrage du serveur
db.sequelize.sync({ force: false })
  .then(() => {
    logger.info('Database synced');

    // Démarrer le serveur en écoutant sur 0.0.0.0
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${port}`);
    });

    // Gestion des erreurs au niveau du serveur
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    logger.error('Error syncing database:', err);
    process.exit(1);
  });
