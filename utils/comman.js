const nodemailer = require("nodemailer");

exports.sendEmail = async (email, link) => {
  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: "2525",
    auth: {
      user: "4dfd0a25b4be01",
      pass: "dc519b7b02bdb2",
    },
  });

  const mailOptions = {
    from: '"Kachari" <kachari@yopmail.com>',
    to: email,
    subject: "Your password reset link",
    text: `Your text content`,
    html: `<div style='border:1px solid pink;padding:20px;font-size:20px'><p>Forget password Your Password.</p><p>Just press the button below and follow the instructions. We’ll have you up and running in no time.</p><p><a href=${link}>Click here..</a></p><p>Thanks<br>Kachari Team</p></div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error :-", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.tokenGenerator = async () => {
  let degit = 50;
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = '';
  for(var i = 0; i < degit; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};
