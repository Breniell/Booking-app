const { google } = require('googleapis');
const path = require('path');

// Utiliser une variable d’environnement ou un chemin relatif par défaut
const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || path.join(__dirname, '..', 'config', 'service-account-file.json');

exports.createEvent = async (req, res) => {
  const { summary, description, startTime, endTime } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const event = {
    summary,
    description,
    start: {
      dateTime: startTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime,
      timeZone: 'UTC',
    },
  };

  calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }, (err, event) => {
    if (err) {
      console.error('Error creating calendar event:', err);
      return res.status(500).send('Error creating event');
    }
    res.status(200).json({ eventId: event.data.id });
  });
};
