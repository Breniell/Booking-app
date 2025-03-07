// models/expert.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Expert = sequelize.define('Expert', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One-to-one relationship
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    expertise: {
      type: DataTypes.STRING
    }
  });

  return Expert;
};
