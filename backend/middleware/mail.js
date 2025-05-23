const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

exports._sendmail = async (email, token, res) => {
    console.log('email', email)
    const transporter = await nodemailer.createTransport({
     host: 'smtp.gmail.com',
    // port: 587,
        secure: false,
        
        auth: {
            user: "your mail",
            pass: "your password"
        },
        tls: {
            rejectUnauthorized: false
          }
    })
    console.log('transporter', transporter)
    const link = process.env.DOMAIN_URL + "/?email="+ email +"&&token=" +token
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        cc: '',
        bcc: '',
        subject: 'confirmation mail',
        text: 'this is done?',
        html: "please verify your email <a href="+link+"> click here</a>"
    }

   const mailInfo = await transporter.sendMail(mailOptions);
   console.log('mailInfo', mailInfo)

}

// exports._sendmail = _sendmail;
