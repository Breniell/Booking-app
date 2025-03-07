// models/availability.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Availability = sequelize.define('Availability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Experts',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Availability;
};
