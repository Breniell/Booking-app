// models/user.js
const { DataTypes } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {                   // Ajout du champ phone
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('expert', 'client'),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
         if (user.changed('password')) {
           const salt = await bcrypt.genSalt(10);
           user.password = await bcrypt.hash(user.password, salt);
         }
      }
    },
    instanceMethods: {
      validPassword: async function(password) {
        return await bcrypt.compare(password, this.password);
      }
    },
    validatePassword: async function(password) {
      return await bcrypt.compare(password, this.password);
    }
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  return User;
};
