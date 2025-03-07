// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  //e.g., 'smtp.gmail.com'
  port: process.env.EMAIL_PORT,  //e.g., 587
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

exports.sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Booking App" <${process.env.EMAIL_USER}>`, // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html  // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
