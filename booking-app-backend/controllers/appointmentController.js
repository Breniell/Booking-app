// controllers/appointmentController.js
const db = require('../models');
const emailService = require('../utils/emailService');

// Create a new appointment (Client Only)
exports.createAppointment = async (req, res) => {
    try {
        const { serviceId, startTime, endTime } = req.body;

        // Ensure the logged-in user is a client
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Unauthorized: Only clients can book appointments' });
        }

        // Verify User
        const client = await db.User.findByPk(req.user.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Fetch the service and its associated expert
        const service = await db.Service.findByPk(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check for time conflicts
        const conflictingAppointments = await db.Appointment.findAll({
            where: {
                expertId: service.expertId,  //Corrected:  Use the expertId from the service
                [db.Sequelize.Op.or]: [
                    {
                        startTime: { [db.Sequelize.Op.lt]: endTime },
                        endTime: { [db.Sequelize.Op.gt]: startTime }
                    }
                ]
            }
        });

        if (conflictingAppointments.length > 0) {
            return res.status(400).json({ message: 'Time slot is not available' });
        }

        const appointment = await db.Appointment.create({
            clientId: req.user.id,  //Corrected: Logged-in Client ID
            expertId: service.expertId, //Corrected:  Expert ID from the Service
            serviceId,
            startTime,
            endTime
        });

        // Notify both client and expert via email
        const expert = await db.User.findByPk(service.expertId); // Expert details
        const appointmentClient = await db.User.findByPk(req.user.id); // Client details

        if (expert && appointmentClient) {
            try {
                // Notify Client
                await emailService.sendEmail(
                    appointmentClient.email,
                    'Appointment Confirmation',
                    `Your appointment with ${expert.firstName} ${expert.lastName} for ${service.name} is scheduled for ${startTime}.`,
                    `<p>Dear ${appointmentClient.firstName},</p><p>Your appointment with ${expert.firstName} ${expert.lastName} for ${service.name} is scheduled for ${startTime}.</p>`
                );

                // Notify Expert
                await emailService.sendEmail(
                    expert.email,
                    'New Appointment',
                    `You have a new appointment with ${appointmentClient.firstName} ${appointmentClient.lastName} scheduled for ${startTime}.`,
                    `<p>Dear ${expert.firstName},</p><p>You have a new appointment with ${appointmentClient.firstName} ${appointmentClient.lastName} for ${service.name} scheduled for ${startTime}.</p>`
                );
            } catch (mailError) {
                console.error("Error sending email:", mailError);
            }
        }
        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
};

// Get an appointment by ID
exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.Appointment.findByPk(id, {
            include: [
                { model: db.User, as: 'Client', attributes: ['firstName', 'lastName', 'email'] },
                { model: db.User, as: 'Expert', attributes: ['firstName', 'lastName', 'email'] },
                { model: db.Service, attributes: ['name', 'description', 'duration', 'price'] }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointment', error: error.message });
    }
};

// Get all appointments for a client
exports.getAppointmentsByClient = async (req, res) => {
    try {
        if (!req.params.clientId || isNaN(req.params.clientId)) {
            return res.status(400).json({ message: 'ID client invalide' });
          }

      const appointments = await db.Appointment.findAll({
        where: { clientId: req.params.clientId },
        include: [
          { 
            model: db.User, 
            as: 'Expert',
            attributes: ['firstName', 'lastName', 'email']
          },
          {
            model: db.Service,
            attributes: ['name', 'price']
          }
        ],
        order: [['startTime', 'DESC']] // Tri par date
      });
   // Formatage des dates
    const formattedAppointments = appointments.map(app => ({
      ...app.get({ plain: true }),
      startTime: new Date(app.startTime).toISOString(),
      endTime: new Date(app.endTime).toISOString()
    }));

    res.status(200).json(formattedAppointments);
    } catch (error) {
      console.error('Erreur backend:', error);
      res.status(500).json({ 
        message: 'Erreur serveur',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

// Get all appointments for an expert
exports.getAppointmentsByExpert = async (req, res) => {
    try {
        const { expertId } = req.params;
        const appointments = await db.Appointment.findAll({
            where: { expertId },
            include: [
                { model: db.User, as: 'Client', attributes: ['firstName', 'lastName', 'email'] },
                { model: db.Service, attributes: ['name', 'description', 'duration', 'price', 'videoPlatform', 'imageUrl'] }
            ]
        });

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
    }
};

// Update an appointment (Expert Only)
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'expert') {
            return res.status(403).json({ message: 'Unauthorized: Only experts can update appointments' });
        }

        const { clientId, serviceId, startTime, endTime, status } = req.body;

        const appointment = await db.Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check that only the expert who created the service is updating
        if (appointment.expertId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own appointments' });
        }

        // Check for time conflicts
        const conflictingAppointments = await db.Appointment.findAll({
            where: {
                id: { [db.Sequelize.Op.ne]: id }, //Exclude current appointment
                expertId: appointment.expertId, //Corrected: Use appointment's expertId.
                [db.Sequelize.Op.or]: [
                    {
                        startTime: { [db.Sequelize.Op.lt]: endTime },
                        endTime: { [db.Sequelize.Op.gt]: startTime }
                    }
                ]
            }
        });

        if (conflictingAppointments.length > 0) {
            return res.status(400).json({ message: 'Time slot is not available' });
        }

        appointment.clientId = clientId;
        appointment.serviceId = serviceId;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        appointment.status = status;
        await appointment.save();

        res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

// Delete an appointment (Expert Only)
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        //Verify User Role
        if (req.user.role !== 'expert') {
            return res.status(403).json({ message: 'Unauthorized: Only experts can delete their appointments' });
        }

        // Check if Expert is Owner
        if (appointment.expertId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your appointments' });
        }

        await appointment.destroy();
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting appointment', error: error.message });
    }
};
