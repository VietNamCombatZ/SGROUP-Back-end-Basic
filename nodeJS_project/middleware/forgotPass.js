const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (option) => {  
  // console.log("check");
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: parseInt(process.env.EMAIL_PORT, 10),
    auth: {
      user: "merlin95@ethereal.email",
      pass: "Aq5pdmuahMGBSckXaQ",
    },
  });

  const emailOptions = {
    from: "Test_Forgot_Pass<ForgotPass@gmail.com>",
    to: option.to,
    subject: option.subject,
    text: option.text
  }

  await transporter.sendMail(emailOptions);

};

module.exports = {sendMail};
