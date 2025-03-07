// models/review.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Services', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    }
  });
  return Review;
};
