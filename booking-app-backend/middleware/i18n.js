// middlewares/i18n.js
const messages = {
    en: {
      authRequired: "Authentication required",
      invalidToken: "Invalid token",
      appointmentCreated: "Appointment created successfully"
    },
    fr: {
      authRequired: "Authentification requise",
      invalidToken: "Token invalide",
      appointmentCreated: "Rendez-vous créé avec succès"
    }
  };
  
  exports.i18n = (req, res, next) => {
    // On peut définir la langue via l'en-tête "Accept-Language"
    const lang = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'fr';
    req.messages = messages[lang] || messages.fr;
    next();
  };
  