import { body, check } from 'express-validator'
import Application from './application_model'
import Tracks from '../tracks/track_model'

const menteeApplyRules = () => {
    return [
        body('firstname').notEmpty().withMessage('First name is required').trim(),
        body('lastname').notEmpty().withMessage('Last name is required').trim(),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
            .withMessage('Enter a valid email')
            .custom(async (value, {}) => {
                const appDoc = await Application.findOne({ email: value })
                if (appDoc) {
                    return Promise.reject('Email already in use')
                }
                return true
            })
            .normalizeEmail(),
        body('track')
            .notEmpty()
            .withMessage('Learning track is required')
            .custom(async (value, {}) => {
                const track = await Tracks.findOne({ name: value })
                if (!track) {
                    return Promise.reject('Learning Track name does not exist')
                }
                return true
            }),
        body('goal').notEmpty().withMessage('Goals of taking this mentorship is required'),
        body('previous_experience').notEmpty().withMessage('Details about previous experience is required'),
    ]
}

export default {
    menteeApplyRules,
}
