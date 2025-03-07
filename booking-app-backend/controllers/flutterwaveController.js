// controllers/flutterwaveController.js
const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.initializePayment = async (req, res) => {
    try {
        const { email, amount } = req.body;

        const response = await flw.Charge.card({
            tx_ref: `tx-${Date.now()}`, // Unique transaction reference
            amount,
            currency: 'XAF',
            payment_type: 'card',
            email,
            redirect_url: `${process.env.BASE_URL}/api/payments/flutterwave/redirect`, // Redirect URL after payment
        });

        res.status(201).json(response);
    } catch (error) {
        console.error('Error initializing Flutterwave payment:', error);
        res.status(500).json({ message: 'Error initializing payment', error: error.message });
    }
};

// Handle payment redirection after successful payment
exports.handleRedirect = async (req, res) => {
    const { status, tx_ref } = req.query; // Get status and transaction reference from query

    // Here you can update your database based on the transaction status
    console.log(`Transaction ${tx_ref} status: ${status}`);

    res.redirect('/success'); // Redirect to a success page or handle accordingly
};
