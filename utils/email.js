const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create Transpoter

  const transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2)Define email options
  const mailOptions = {
    from: 'Abisola Akrindie <hello@abi.io>',
    to: options?.email,
    subject: options?.subject,
    text: options?.message,
    // html
  };
  //3)Actually send email
  await transpoter.sendMail(mailOptions);
};
module.exports = sendEmail;
