// models/appointment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    expertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', //Experts are also users
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    }
  });

  return Appointment;
};
