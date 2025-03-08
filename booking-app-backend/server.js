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
const expertStatsRoutes = require('./routes/expertStatsRoutes');
const orangeMoneyRoutes = require('./routes/orangeMoneyRoutes');
const mtnMomoRoutes = require('./routes/mtnMomoRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

dotenv.config();
const port = process.env.PORT;
if (!port) {
  console.error("❌ PORT n'est pas défini dans les variables d'environnement !");
  process.exit(1);
}
console.log(`🔍 Trying to start server on port: ${port}`);


// Activer les logs détaillés
app.use(morgan('dev'));

// Middleware
app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3000', // Adresse du frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite chaque IP à 100 requêtes par fenêtre
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/experts', expertStatsRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('Booking App Backend is running!');
});

// Middleware de gestion des erreurs (doit être défini après les routes)
app.use(errorHandler);

// Synchronisation de la base de données et démarrage du serveur
db.sequelize.sync({ force: false })
  .then(() => {
    logger.info('Database synced');
    // Modification ici : écoute sur "0.0.0.0" pour que le serveur soit accessible depuis l'extérieur
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error('Error syncing database:', err);
  });
