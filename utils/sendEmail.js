const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const { res } = options;
  // let's create a transport to send email
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
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
  res.status(200).json({
    success: true,
    message: `Email sent to ${options.email} successfully`,
  });
};

module.exports = sendEmail;
