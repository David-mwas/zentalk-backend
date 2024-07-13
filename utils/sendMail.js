const nodeMailer = require("nodemailer");
const { convert } = require("html-to-text");

exports.sendMail = (payload) => {
  return new Promise((resolve, reject) => {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.gmailUser,
        pass: process.env.gmailPass,
      },

      tls: {
        rejectUnauthorized: false, // Add this line
      },
    });
    const text = convert(payload.html, { wordwrap: 130 });
    const mailOptions = {
      from: process.env.gmailUser,
      to: payload.email,
      subject: payload.subject,
      text: payload.html,
      html: payload.html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info?.response);
    });
  });
};

// const nodeMailer = require("nodemailer");
// const { convert } = require("html-to-text");

// exports.sendMail = (payload) => {
//   return new Promise((resolve, reject) => {
//     const transporter = nodeMailer.createTransport({
//       host: "gmail",
//       port: 465,
//       secure: true, // use SSL
//       auth: {
//         user: process.env.gmailUser,
//         pass: process.env.gmailPass,
//       },
//       tls: {
//         rejectUnauthorized: false, // Ignore self-signed certificate errors
//       },
//     });

//     const text = convert(payload.html, { wordwrap: 130 });
//     const mailOptions = {
//       from: process.env.gmailUser,
//       to: payload.email,
//       subject: payload.subject,
//       text: text,
//       html: payload.html,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         reject(error);
//       }
//       resolve(info?.response);
//     });
//   });
// };
