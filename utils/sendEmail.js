const nodeMailer = require("nodemailer");

const sendEmail = (options) => {
  // let's create a transport to send email
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,

    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOPtions = {
    // from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  transporter.sendMail(mailOPtions, (err, data) => {
    if (err) {
      console.log(err);
    } else if (data) {
      // console.log(data);
      res.status(200).json({
        success: true,
        message: `Email sent to ${options.email} successfully with reset token`,
      });
    }
  });
};

module.exports = sendEmail;
