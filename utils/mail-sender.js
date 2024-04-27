const nodemailer = require("nodemailer");

const 
mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST,  // we must write here which platform we used for sending the mail
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
    });

    const info = await transporter.sendMail({
        from: 'shubhammahatma21@gmail.com', // sender address
        to: `${email}`, // list of receivers
        subject: `${title}`, // Subject line
        html: `${body}`, // html body means otp value come from Body
      });

      return info;

  } catch (error) {
    console.log("Error while genereting the otp",error);
  }
};

module.exports = mailSender;
