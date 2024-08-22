var nodemailer = require('nodemailer');
var http = require('http');
var url = require('url');
var dotenv = require('dotenv');
dotenv.config()

exports.sendMail = async(email, subject, content) => {
    try {
        console.log("Creating Transport")
        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            }
        });
        var mailOptions = {
          from: process.env.USER,
          to: email,
          subject: subject,
          html: content
        }
        console.log("Sending mail")
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log('Email sent: ' + info.response)
                return true;
            }
        })
    } catch (error) {
        console.log(error);
        return false;
    }
}

// sendMail('royhensley728@gmail.com', 'Test', 'test')