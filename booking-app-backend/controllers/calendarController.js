// controllers/calendarController.js
const { google } = require('googleapis');

exports.createEvent = async (req, res) => {
    const { summary, description, startTime, endTime } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: 'D:\developpement\booking-app-backend\config\client_secret_788214524608-dt85il232i9ifbqoeia9us35980ug449.apps.googleusercontent.com.json', // Path to your service account key file
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
