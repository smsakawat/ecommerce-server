const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // let's create a transport to send email
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,

    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOPtions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: "email here",
  };
  await transporter.sendMail(mailOPtions);
};

module.exports = sendEmail;
