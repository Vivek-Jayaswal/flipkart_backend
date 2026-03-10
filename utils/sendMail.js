const nodemailer = require("nodemailer");

require("dotenv").config(); // Load environment variables

const sendOTP = async (recipientEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use 'gmail' or configure a custom SMTP host/port
    port: 465, // For Gmail, use 587 for TLS
    secure: true, // Use SSL for port 465
    host: "smtp.gmail.com", // Gmail SMTP server
    auth: {
      user: process.env.USER_EMAIL, // Your email address from .env
      pass: process.env.APP_PASSWORD, // Your App Password from .env
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL, // Sender address
    to: recipientEmail,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`, // Use HTML for a nicely formatted email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendOTP };
