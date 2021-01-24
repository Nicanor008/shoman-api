import Content from './content_model'
const User = require('../users/users_model')
import { InternalServerError, CustomError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
import validateDate from '../../../utils/checkDate'

export async function createContent(req, res, next) {
    try {
        const userId = req.userData.id
        const { category, topic, content, focusGroup, estimatedDuration, deadline } = req.body
        const isdateValid = validateDate(dueDate)
        if (!isdateValid) {
            return next(new CustomError(422, 'Invalid date entered, Deadline must be after current Date'))
        }
        const user = await User.findOne({ _id: userId, userType: 'mentor' })
        if (!user) return next(new CustomError(401, 'Not authorized'))
        const payload = {
            category,
            estimatedDuration,
            deadline: new Date(deadline),
            content,
            topic,
            focusGroup: focusGroup == 'my mentees' ? user.teamNumber : 'shoman',
            author: userId,
        }
        const newContent = await new Content(payload).save()
        if (!newContent) {
            return next(new CustomError(400, "Content creation wasn't successful"))
        }
        return responseHandler(res, 201, newContent, 'Content has been created successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

// export async function getAllTeams(req, res, next) {
//     try {
//         const queryOptions = {}
//         let { page, limit, search } = req.query
//         let teams, totalCount
//         page = parseInt(page, 10) || 1
//         limit = parseInt(limit, 10) || 10
//         if (search) queryOptions['team_name'] = { $regex: search, $options: 'i' }
//         teams = await Team.find(queryOptions)
//             .skip((page - 1) * limit)
//             .limit(limit * 1)
//             .sort({ createdAt: -1 })
//             .exec()
//         totalCount = await Team.countDocuments(queryOptions)
//         if (totalCount === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'No team(s) available',
//             })
//         }
//         return res.status(200).json({
//             status: 'success',
//             totalCount,
//             teams,
//             totalPages: Math.ceil(totalCount / limit),
//             currentPage: page,
//         })
//     } catch (error) {
//         next(new InternalServerError(error))
//     }
// }

// export async function getATeam(req, res, next) {
//     try {
//         const { teamId } = req.params
//         const team = await Team.findById(teamId)
//         if (!team) {
//             return next(new CustomError(404, "Team doesn't exist or has been deleted"))
//         }
//         return responseHandler(res, 200, team, 'Team found')
//     } catch (error) {
//         next(new InternalServerError(error))
//     }
// }

// export async function deleteTeam(req, res, next) {
//     const { teamId } = req.params
//     try {
//         const team = await Team.findByIdAndDelete(teamId)
//         if (!team) {
//             return next(new CustomError(404, "Team with the ID doesn't exist or has already been deleted"))
//         }
//         return responseHandler(res, 200, team, 'Team deleted successfully')
//     } catch (error) {
//         next(new InternalServerError(error))
//     }
// }

// export async function addUsersToTeam(req, res, next) {
//     try {
//         const { menteesId, mentorId } = req.body
//         const { teamId } = req.params
//         const updateFields = {
//             $addToSet: {
//                 menteesId: {
//                     $each: menteesId,
//                 },
//             },
//         }
//         if (mentorId) {
//             updateFields['$set'] = { mentorId }
//         }
//         const updatedTeam = await Team.findByIdAndUpdate(teamId, updateFields)
//         if (!updatedTeam) {
//             return next(new CustomError(404, "Team with the ID doesn't exist or has been deleted"))
//         }
//         const updateMenteesTeamNo = await User.updateMany({ _id: { $in: menteesId } }, { $set: { teamNumber: updatedTeam.team_number } }, { new: true })
//         if (!updateMenteesTeamNo) {
//             return next(new CustomError(404, "Error encountered while updating mentees' team numbers"))
//         }
//         // update the mentor's team number also if included during creation
//         if (mentorId) {
//             const updateMentorTeamNo = await User.findByIdAndUpdate(
//                 mentorId,
//                 {
//                     $set: { teamNumber: updatedTeam.team_number },
//                 },
//                 { new: true },
//             )
//             if (!updateMentorTeamNo) {
//                 return next(new CustomError(404, "Error encountered while updating mentor's team number"))
//             }
//         }
//         return responseHandler(res, 200, updatedTeam, 'User(s) added to team successfully')
//     } catch (error) {
//         next(new InternalServerError(error))
//     }
// }
