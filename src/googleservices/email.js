const nodemailer = require('nodemailer')
const { google } = require('googleapis')
import * as jwt from '../validations/jwtService'

const OAuth2 = google.auth.OAuth2

// Step 1
export const sendMail = async (data) => {
    let oauth2Client = new OAuth2(
        process.env.CLIENTID,
        process.env.CLIENTSECRET
    )

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESHTOKEN,
    })

    const accessToken = await oauth2Client.getAccessToken()

    let transporter = nodemailer.createTransport({
        service: 'gmail.com',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            type: 'OAuth2',
            user: 'shomancodes@gmail.com',
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            refreshToken: process.env.REFRESHTOKEN,
            accessToken: accessToken,
        },

        secure: true,
    })

    let link = `${data.domain}/verify-email?token=${jwt.jwtSignature(
        data.toMail
    )}`

    // Step 2
    let mailOptions = {
        from: 'shomancodes@gmail.com',
        to: data.toMail,
        subject: data.subject,
        text: data.text,
        generateTextFromHTML: true,
        html: `<div><h4>Thank you ${data.Username} and welcome to the Shoman Mentorship Progmram where we help you levelup  your Skills</h4></div>
    <div><h5>To get started click on the button below to have your eamil verified 😊😊😊.</h5></div>
   <div> <a href=${link}><button>Verify</button></a></div>`,
    }

    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs', err)
        }
        return console.log('Email sent!!!')
    })
}
