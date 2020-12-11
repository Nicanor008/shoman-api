import { body, check } from 'express-validator'
import mongoose from 'mongoose'
import Team from './team_model'
import Tracks from '../tracks/track_model'
const User = require('../users/users_model')
const {
    Types: { ObjectId },
} = mongoose

const teamCreateRules = () => {
    return [
        body('team_name')
            .notEmpty()
            .withMessage('Team name is required')
            .trim()
            .custom(async (value, {}) => {
                const teamDoc = await Team.findOne({ team_name: value })
                if (teamDoc) {
                    return Promise.reject('Team name already taken')
                }
                return true
            }),
        body('mentorId', 'Ensure you enter a valid ID')
            .isMongoId()
            .custom(async (value, {}) => {
                const userExist = await User.findById(value)
                if (!userExist) {
                    return Promise.reject('User with the ID does not exist')
                }
                if (userExist.userType != 'mentor') {
                    return Promise.reject('Ensure the user is a mentor')
                }
                return true
            }),
        body('trackId', 'Ensure you enter a valid ID')
            .isMongoId()
            .custom(async (value, {}) => {
                const trackExist = await Tracks.findById(value)
                if (!trackExist) {
                    return Promise.reject('Track with the ID does not exist')
                }
                return true
            }),
    ]
}

const addMenteesToTeamRules = () => {
    return [check('teamId', 'Ensure you enter a valid ID').isMongoId(), body('menteesId', 'Expected an array, mentees can not be empty').isArray()]
}

export default {
    teamCreateRules,
    addMenteesToTeamRules,
}
