import Application from './application_model'
import { InternalServerError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
import { sendEmail, compileEjs } from '../../../utils/email'

export async function applyForMentorship(req, res, next) {
    try {
        const { firstname, lastname, email, track, previous_experience, goal, laptop, fully_available, internet_access } = req.body
        const fullname = `${lastname} ${firstname}`
        const application = await new Application({
            fullname,
            email,
            goal,
            track,
            requirements_check: {
                laptop,
                fully_available,
                internet_access,
            },
            goal,
            previous_experience,
        }).save()
        const message = compileEjs({ template: 'general-template' })({
            header: 'Application in review',
            body: `<br> Welcome to the Shoman Mentorship Program where we help you levelup  your Skills.
            Your application as a mentee is under-going review. <br>
            This may take a while as we are experiencing a larger than normal volume of mentorship requests recently
            and we are working through them as quickly as we can in order they are received.<br>
            We would get back to you in due time. If you have other questions regarding your application, don't 
            hesitate to send us a mail.
            <br><br>
            Best Regards`,
            name: firstname,
            ctaText: 'Welcome',
            ctaLink: ``,
        })
        sendEmail({
            html: message,
            subject: 'Shoman Mentorship Application',
            to: email,
        })

        return responseHandler(res, 201, application, 'Application sent. Check email for more.')
    } catch (error) {
        next(new InternalServerError(error))
    }
}
