import Application from './application_model'
import Tracks from '../tracks/track_model'
import { InternalServerError, CustomError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
import sendReviewMail from '../../../googleservices/apply'

export async function applyForMentorship(req, res, next) {
    try {
        const {
            firstname,
            lastname,
            email,
            track,
            previous_experience,
            goal,
            laptop,
            fully_available,
            internet_access,
        } = req.body
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
        sendReviewMail({
            toMail: email,
            subject: 'Shoman Mentorship Application',
            text: 'Application in review',
            firstname: firstname,
        })

        return responseHandler(
            res,
            201,
            application,
            'Application sent. Check email for more.'
        )
    } catch (error) {
        next(new InternalServerError(error))
    }
}
