// backend/middleware/validationMiddleware.js
exports.validateAppointment = (req, res, next) => {
    const { startTime, endTime } = req.body;
    
    if (!moment(startTime).isBefore(endTime)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_TIMESLOT',
        message: 'La date de fin doit être après la date de début'
      });
    }
    
    next();
  };