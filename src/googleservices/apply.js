import { createTransport } from 'nodemailer'
import { config } from 'dotenv'

config()

const sendReviewMail = async (data) => {
    let transporter = createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.PASSWORD,
        },
    })
    let mailOptions = {
        from: 'shomancodes@gmail.com',
        to: data.toMail,
        subject: data.subject,
        text: data.text,
        generateTextFromHTML: true,
        html: `<h4 style="display: flex; align-items: center;">Hi ${data.firstname}, <br> Welcome to the Shoman Mentorship Program where we help you levelup  your Skills.</h4>
        <p>Your application as a mentee is under-going review. <br>
        This may take a while as we are experiencing a larger than normal volume of mentorship requests recently
        and we are working through them as quickly as we can in order they are received. </p><br>
        <p>We would get back to you in due time. If you have other questions regarding your application, don't 
        hesitate to send us a mail 😊😊.</p>
        <br><br>
        <h3>Best Regards, <b><span style="color: red;">Shoman</span></b> Team.</h3>
    `,
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs', err)
        }
        return console.log('Email sent!!!')
    })
}

export default sendReviewMail
