// controllers/orangeMoneyController.js
require('dotenv').config();
const { OrangeMoneyPayment, TargetEnvironment } = require('@spreeloop/orange_money');
const Flutterwave = require('flutterwave-node-v3');

const config = {
  targetEnvironment: TargetEnvironment.prod, // Use TargetEnvironment.fake for testing
  apiUserName: process.env.ORANGE_MONEY_API_USERNAME,
  apiPassword: process.env.ORANGE_MONEY_API_PASSWORD,
  xAuthToken: process.env.ORANGE_MONEY_X_AUTH_TOKEN,
  logger: console,
};

// Initialize Orange Money Payment instance
const payment = OrangeMoneyPayment.createPayment(config);

// Initialize Flutterwave
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Initialize a payment
exports.initializePayment = async (req, res) => {
  try {
    const { description, subscriberNumber, amount, email } = req.body;

    // First, attempt Orange Money payment
    try {
      const accessTokenResponse = await payment.getAccessToken();
      const payTokenResponse = await payment.getPayToken(accessTokenResponse.accessToken);

      const initializationResponse = await payment.initializeOrangeMoneyPayment({
        description,
        subscriberNumber,
        channelUserNumber: subscriberNumber,
        transactionId: `TX-${Date.now()}`, // Unique transaction ID
        amount,
        notifUrl: `${process.env.BASE_URL}/api/payments/orange-money/notify`, // Notification URL
        payToken: payTokenResponse.payToken,
        accessToken: accessTokenResponse.accessToken,
      });

      return res.status(201).json({
        message: 'Orange Money Payment initialized successfully',
        data: initializationResponse,
      });
    } catch (orangeMoneyError) {
      console.error('Orange Money payment failed, attempting Flutterwave:', orangeMoneyError);

      // Attempt Flutterwave payment as a fallback
      try {
        const response = await flw.Charge.card({
          tx_ref: `tx-${Date.now()}`, // Unique transaction reference
          amount,
          currency: 'XAF',
          payment_type: 'mobilemoney',
          email,
          redirect_url: `${process.env.BASE_URL}/api/payments/flutterwave/redirect`, // Redirect URL after payment
        });

        return res.status(201).json({
          message: 'Flutterwave payment initialized as fallback',
          data: response,
        });
      } catch (flutterwaveError) {
        console.error('Flutterwave payment also failed:', flutterwaveError);
        return res.status(500).json({
          message: 'Both Orange Money and Flutterwave payments failed',
          orangeMoneyError: orangeMoneyError.message,
          flutterwaveError: flutterwaveError.message,
        });
      }
    }
  } catch (error) {
    console.error('Error initializing Orange Money payment:', error);
    res.status(500).json({ message: 'Error initializing payment', error: error.message });
  }
};

// Handle payment notifications
exports.handleNotification = async (req, res) => {
  try {
    const { payToken } = req.body;

    const statusResponse = await payment.getOrangeMoneyPaymentStatus({
      payToken,
      accessToken: req.headers.authorization.split(' ')[1], // Extract access token from headers
    });

    console.log('Payment status:', statusResponse);

    // Update your database based on the statusResponse
    res.status(200).json({ message: 'Notification received', data: statusResponse });
  } catch (error) {
    console.error('Error handling notification:', error);
    res.status(500).json({ message: 'Error handling notification', error: error.message });
  }
};
