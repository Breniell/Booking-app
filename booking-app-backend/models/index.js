// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
let sequelize;
if (dbConfig.use_env_variable) {
  // usage de l’URI complète
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  // mode développement
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,},
    dbConfig
  );
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import des modèles
db.User = require('./user')(sequelize, Sequelize);
db.Expert = require('./expert')(sequelize, Sequelize);
db.Service = require('./service')(sequelize, Sequelize);
db.Appointment = require('./appointment')(sequelize, Sequelize);
db.Availability = require('./availability')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);

// Association entre User et Expert
db.User.hasOne(db.Expert, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
db.Expert.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// Association entre Expert et Service
db.Expert.hasMany(db.Service, {
  foreignKey: 'expertId',
  onDelete: 'CASCADE'
});
db.Service.belongsTo(db.Expert, { foreignKey: 'expertId' });

// Association entre Appointment et User (Client)
db.User.hasMany(db.Appointment, {
  foreignKey: 'clientId',
  as: 'ClientAppointments',
  onDelete: 'CASCADE'
});
db.Appointment.belongsTo(db.User, { foreignKey: 'clientId', as: 'Client' });

// Association entre Appointment et User (Expert)
db.User.hasMany(db.Appointment, {
  foreignKey: 'expertId',
  as: 'ExpertAppointments',
  onDelete: 'CASCADE'
});
db.Appointment.belongsTo(db.User, { foreignKey: 'expertId', as: 'Expert' });

// Associer le modèle Service aux Appointments avec l'alias "appointments"
db.Service.hasMany(db.Appointment, {
  foreignKey: 'serviceId',
  onDelete: 'CASCADE',
  as: 'appointments'
});

// Définir l'appartenance d'Appointment au Service via l'alias "service"
db.Appointment.belongsTo(db.Service, {
  foreignKey: 'serviceId',
  as: 'service'
});

// Autres associations (Availability, Review, etc.)
db.Expert.hasMany(db.Availability, { foreignKey: 'expertId', onDelete: 'CASCADE' });
db.Availability.belongsTo(db.Expert, { foreignKey: 'expertId' });

db.Service.hasMany(db.Review, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Service, { foreignKey: 'serviceId' });
db.User.hasMany(db.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Review.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
