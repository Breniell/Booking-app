// models/Subscription.js
module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      plan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'cancelled', 'past_due'),
        defaultValue: 'active'
      },
      stripeSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
    return Subscription;
  };
  