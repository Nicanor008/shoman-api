import { Application, Track } from '../models/'
import { InternalServerError, CustomError } from '../utils/customError'
import responseHandler from '../utils/responseHandler'
import sendReviewMail from '../googleservices/apply'

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
        const addedTrack = await Track.findOneAndUpdate(
            { name: track },
            {
                $push: { applications: application._id },
            },
            { new: true }
        )
        if (!addedTrack) {
            return next(
                new CustomError(
                    400,
                    'Error occurred. Unable to update Track with the new application'
                )
            )
        }
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
