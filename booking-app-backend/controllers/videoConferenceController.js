// controllers/videoConferenceController.js
const axios = require('axios');
const { google } = require('googleapis');
require('dotenv').config();

// Function to create a Zoom meeting
exports.createZoomMeeting = async (req, res) => {
    const { topic, start_time } = req.body;

    const options = {
        method: 'POST',
        url: 'https://api.zoom.us/v2/users/me/meetings',
        headers: {
            'Authorization': `Bearer ${process.env.ZOOM_JWT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        data: {
            topic,
            type: 2,
            start_time,
            duration: 60,
            timezone: 'UTC',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: true,
                mute_upon_entry: false,
                waiting_room: false,
            },
        },
    };

    try {
        const response = await axios.request(options);
        res.status(201).json({ meetingId: response.data.id, joinUrl: response.data.join_url, provider: 'zoom' });
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        res.status(500).send('Error creating Zoom meeting');
    }
};

// Function to create a Google Meet meeting
exports.createGoogleMeet = async (req, res) => {
    const { summary, description, startTime, endTime } = req.body;

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'path/to/your/service-account-file.json',  //Replace!
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
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`, //Unique request ID
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }
        };

        const request = {
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1, //Important!
        };

        const calendarResponse = await calendar.events.insert(request);
        res.status(201).json({ meetingId: calendarResponse.data.id, joinUrl: calendarResponse.data.hangoutLink, provider: 'googleMeet' });

    } catch (error) {
        console.error('Error creating Google Meet:', error);
        res.status(500).send('Error creating Google Meet');
    }
};
