// controllers/mtnMomoController.js
const axios = require('axios');
const Flutterwave = require('flutterwave-node-v3');

// Initialize Flutterwave
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Initialize an MTN MoMo payment
exports.initializeMomoPayment = async (req, res) => {
  try {
    const { phoneNumber, amount, email } = req.body;
    const transactionId = `TX-${Date.now()}`; // Unique transaction ID

    try {
      const response = await axios.post(
        `${process.env.MTN_MOMO_API_BASE_URL}/v1/paymentrequest`,
        {
          phoneNumber,
          amount,
          currency: 'XAF',
          transactionId,
          callbackUrl: `${process.env.BASE_URL}/api/payments/mtn-momo/notify`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MTN_MOMO_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(201).json({
        message: 'MTN MoMo Payment initialized successfully',
        data: response.data,
      });
    } catch (mtnMomoError) {
      console.error('MTN MoMo payment failed, attempting Flutterwave:', mtnMomoError);

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
          message: 'Both MTN MoMo and Flutterwave payments failed',
          mtnMomoError: mtnMomoError.message,
          flutterwaveError: flutterwaveError.message,
        });
      }
    }
  } catch (error) {
    console.error('Error initializing MTN MoMo payment:', error);
    res.status(500).json({ message: 'Error initializing payment', error: error.message });
  }
};

// Handle MTN MoMo notifications
exports.handleNotification = async (req, res) => {
  try {
    const { transactionId } = req.body;

    console.log('Transaction ID:', transactionId);

    // Verify transaction status using your preferred API or database logic

    res.status(200).json({ message: 'Notification received' });
  } catch (error) {
    console.error('Error handling notification:', error);
    res.status(500).json({ message: 'Error handling notification', error: error.message });
  }
};
