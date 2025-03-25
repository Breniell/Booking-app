// controllers/subscriptionController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res) => {
  try {
    // Attendu: customerId et priceId dans req.body
    const { customerId, priceId } = req.body;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });
    return res.status(201).json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const cancellation = await stripe.subscriptions.del(subscriptionId);
    return res.status(200).json({ message: 'Subscription cancelled successfully', cancellation });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};
