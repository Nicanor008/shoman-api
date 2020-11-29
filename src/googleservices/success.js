const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const OAuth2 = google.auth.OAuth2
import * as jwt from '../validations/jwtService'

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

    // Step 2
    let mailOptions = {
        from: 'shomancodes@gmail.com',
        to: data.toMail,
        subject: data.subject,
        text: data.text,
        generateTextFromHTML: true,
        html: `<div><h3>Hae ${data.Username} Your password has successfully been changed</h3></div>
      <div><h4>You can now login using your new password</h4></div>
     <div><h5>Thank you for your continued support 😊😊</h5></div>`,
    }

    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs', err)
        }
        return console.log('Email sent!!!')
    })
}
