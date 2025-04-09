// src/utils/notificationService.js
const emailService = require('./emailService');
// Exemple pour SMS (à intégrer avec Twilio ou autre fournisseur)
const sendSMS = async (to, message) => {
  console.log(`SMS envoyé à ${to}: ${message}`);
};

exports.sendNotification = async (user, subject, text, html) => {
  try {
    await emailService.sendEmail(user.email, subject, text, html);
    if (user.phone) {
      await sendSMS(user.phone, text);
    }
    // Vous pouvez ajouter ici une intégration push (Firebase, OneSignal, etc.)
    console.log('Notification envoyée');
  } catch (error) {
    console.error('Erreur lors de l’envoi de la notification:', error);
  }
};
