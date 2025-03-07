// models/service.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Experts',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    duration: {
      type: DataTypes.INTEGER,  // Duration in minutes
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    videoPlatform: { // Nouveau champ
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {                    // <-- nouveau champ
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/assets/default-service.jpg'  // image par défaut
    }
  });

  return Service;
};
