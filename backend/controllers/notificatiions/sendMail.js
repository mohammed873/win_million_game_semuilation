require("dotenv").config;
const nodemailer = require("nodemailer");

exports.sendMail = async (to) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL, // TODO: your gmail account
      pass: process.env.ADMIN_PASSWORD, // TODO: your gmail password
    },
  });

  let mailOptions = {
    from: process.env.ADMIN_EMAIL, // TODO: email sender
    to: to, // TODO: email receiver
    subject: "Participation validated",
    html: "<h1>Participation validated</h1>",
  };

  let info = await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs");
    }
  });
};
