import Team from './team_model'
const User = require('../users/users_model')
import { InternalServerError, CustomError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'

export async function createTeam(req, res, next) {
    try {
        const { team_name, mentorId, trackId } = req.body
        let teamNumber
        const lastEntry = await Team.findOne().sort({ $natural: -1 }).limit(1)
        if (lastEntry) {
            // team names starting with SH- for shoman
            teamNumber = `SH-${parseInt(team.team_number.slice(3)) + 1}` // generate team number from last entry
        } else {
            teamNumber = 'SH-101' // starting with 101 but could be changed
        }
        const newTeam = await new Team({
            team_name,
            mentorId,
            main_trackId: trackId,
            team_number: teamNumber,
        }).save()
        if (!newTeam) {
            return next(new CustomError(400, "Team creation wasn't successful"))
        }
        const updateMentorTeamNo = await User.findByIdAndUpdate(
            mentorId,
            {
                $set: { teamNumber },
            },
            { new: true },
        )
        if (!updateMentorTeamNo) {
            return next(new CustomError(404, "Error encountered while updating mentor's team number"))
        }
        return responseHandler(res, 201, newTeam, 'Team created successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getAllTeams(req, res, next) {
    try {
        const queryOptions = {}
        let { page, limit, search } = req.query
        let teams, totalCount
        page = parseInt(page, 10) || 1
        limit = parseInt(limit, 10) || 10
        if (search) queryOptions['team_name'] = { $regex: search, $options: 'i' }
        teams = await Team.find(queryOptions)
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ createdAt: -1 })
            .exec()
        totalCount = await Team.countDocuments(queryOptions)
        if (totalCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No Matching Team found',
            })
        }
        return res.status(200).json({
            status: 'success',
            totalCount,
            teams,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getATeam(req, res, next) {
    try {
        const { teamId } = req.params
        const team = await Team.findById(teamId)
        if (!team) {
            return next(new CustomError(404, "Team doesn't exist or has been deleted"))
        }
        return responseHandler(res, 200, team, 'Team found')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function deleteTeam(req, res, next) {
    const { teamId } = req.params
    try {
        const team = await Team.findByIdAndDelete(teamId)
        if (!team) {
            return next(new CustomError(404, "Team with the ID doesn't exist or has already been deleted"))
        }
        return responseHandler(res, 200, team, 'Team deleted successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function addUsersToTeam(req, res, next) {
    try {
        const { menteesId } = req.body
        const { teamId } = req.params
        const updatedTeam = await Team.findByIdAndUpdate(teamId, {
            $addToSet: {
                // pushes an array of mentees to the schema
                menteesId: {
                    $each: menteesId, // if id already exists, menteeId is not added to avoid duplicates
                },
            },
        })
        if (!updatedTeam) {
            return next(new CustomError(404, "Team with the ID doesn't exist or has been deleted"))
        }
        const updateMenteesTeamNo = await User.updateMany({ _id: { $in: menteesId } }, { $set: { teamNumber: updatedTeam.team_number } }, { new: true })
        if (!updateMenteesTeamNo) {
            return next(new CustomError(404, "Error encountered while updating mentees' team numbers"))
        }
        return responseHandler(res, 200, updatedTeam, 'Mentees added to team successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}
