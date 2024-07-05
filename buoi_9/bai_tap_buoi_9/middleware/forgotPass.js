const nodemailer = require("nodemailer");

const sendMail = async (option) => {  
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailOptions = {
    from: "Test Forgot Pass <ForgotPass@gmail.com>",
    to: option.email,
    subject: option.subject,
    message: option.message
  }

  await transporter.sendMail(emailOptions);

};

exports.module = sendMail;
