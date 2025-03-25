// models/Payment.js
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Appointments', key: 'id' }
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
      },
      paymentProvider: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    return Payment;
  };
  