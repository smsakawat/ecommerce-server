const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // let's create a transport to send email
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    // host: "smtp.gmail.com",
    // port: 587,
    // why the hack i am not getting email in inbox..fuck you nodemailer
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOPtions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOPtions);
};

module.exports = sendEmail;
