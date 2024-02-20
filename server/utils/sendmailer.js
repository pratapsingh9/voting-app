const nodemailer = require("nodemailer");

const SendEmail = (
  hostemail,
  hostpassword,
  name,
  username,
  content,
  senderemail
) => {
  const Transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      //   user: "hannusingh963@gmail.com",
      user: hostemail,
      pass: hostpassword,
      //   pass: "pratapsingh963",
    },
  });

  const mailOptions = {
    // from: "hannusingh963@gmail.com",
    from: hostemail,
    to: senderemail,
    subject: `Thanks @${name}`,
    text: `Thanks For ${username} ${content}`,
  };

  Transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`email sended  ${info.response} ${info.envelope} `);
    }
  });
};



module.exports = {
  SendEmail
}