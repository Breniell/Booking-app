// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

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

// Associations
db.User.hasOne(db.Expert, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
db.Expert.belongsTo(db.User, { foreignKey: 'userId', as: 'User' }); // Alias ajouté

db.Expert.hasMany(db.Service, {
  foreignKey: 'expertId',
  onDelete: 'CASCADE'
});
db.Service.belongsTo(db.Expert, { foreignKey: 'expertId' });

db.User.hasMany(db.Appointment, {
  foreignKey: 'clientId',
  as: 'ClientAppointments',
  onDelete: 'CASCADE'
});
db.Appointment.belongsTo(db.User, { foreignKey: 'clientId', as: 'Client' });

db.User.hasMany(db.Appointment, {
  foreignKey: 'expertId',
  as: 'ExpertAppointments',
  onDelete: 'CASCADE'
});
db.Appointment.belongsTo(db.User, { foreignKey: 'expertId', as: 'Expert' });

db.Service.hasMany(db.Appointment, {
  foreignKey: 'serviceId',
  onDelete: 'CASCADE'
});
db.Appointment.belongsTo(db.Service, { foreignKey: 'serviceId' });

db.Expert.hasMany(db.Availability, { foreignKey: 'expertId', onDelete: 'CASCADE' });
db.Availability.belongsTo(db.Expert, { foreignKey: 'expertId' });

// Associations pour Review
db.Service.hasMany(db.Review, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Service, { foreignKey: 'serviceId' });
db.User.hasMany(db.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Review.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
