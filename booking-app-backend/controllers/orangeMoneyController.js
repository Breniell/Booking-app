// controllers/orangeMoneyController.js
require('dotenv').config();
const { OrangeMoneyPayment, TargetEnvironment } = require('@spreeloop/orange_money');
const Flutterwave = require('flutterwave-node-v3');

const config = {
  targetEnvironment: TargetEnvironment.prod,
  apiUserName: process.env.ORANGE_MONEY_API_USERNAME,
  apiPassword: process.env.ORANGE_MONEY_API_PASSWORD,
  xAuthToken: process.env.ORANGE_MONEY_X_AUTH_TOKEN,
  logger: console,
};

const payment = OrangeMoneyPayment.createPayment(config);
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.initializePayment = async (req, res) => {
  try {
    const { description, subscriberNumber, amount, email } = req.body;
    try {
      const accessTokenResponse = await payment.getAccessToken();
      const payTokenResponse = await payment.getPayToken(accessTokenResponse.accessToken);
      const initializationResponse = await payment.initializeOrangeMoneyPayment({
        description,
        subscriberNumber,
        channelUserNumber: subscriberNumber,
        transactionId: `TX-${Date.now()}`,
        amount,
        notifUrl: `${process.env.BASE_URL}/api/payments/orange-money/notify`,
        payToken: payTokenResponse.payToken,
        accessToken: accessTokenResponse.accessToken
      });
      return res.status(201).json({
        message: 'Orange Money Payment initialized successfully',
        data: initializationResponse
      });
    } catch (orangeMoneyError) {
      console.error('Orange Money payment failed, attempting Flutterwave:', orangeMoneyError);
      try {
        const response = await flw.Charge.card({
          tx_ref: `tx-${Date.now()}`,
          amount,
          currency: 'XAF',
          payment_type: 'mobilemoney',
          email,
          redirect_url: `${process.env.BASE_URL}/api/payments/flutterwave/redirect`
        });
        return res.status(201).json({
          message: 'Flutterwave payment initialized as fallback',
          data: response
        });
      } catch (flutterwaveError) {
        console.error('Flutterwave payment also failed:', flutterwaveError);
        return res.status(500).json({
          message: 'Both Orange Money and Flutterwave payments failed',
          orangeMoneyError: orangeMoneyError.message,
          flutterwaveError: flutterwaveError.message
        });
      }
    }
  } catch (error) {
    console.error('Error initializing Orange Money payment:', error);
    return res.status(500).json({ message: 'Error initializing payment', error: error.message });
  }
};

exports.handleNotification = async (req, res) => {
  try {
    const { payToken } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const accessToken = authHeader.split(' ')[1];
    const statusResponse = await payment.getOrangeMoneyPaymentStatus({
      payToken,
      accessToken
    });
    console.log('Payment status:', statusResponse);
    return res.status(200).json({ message: 'Notification received', data: statusResponse });
  } catch (error) {
    console.error('Error handling notification:', error);
    return res.status(500).json({ message: 'Error handling notification', error: error.message });
  }
};
