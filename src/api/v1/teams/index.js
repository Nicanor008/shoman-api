import { Router } from 'express'
import validations from './team_validation'
import { validate, validateTeamId } from '../../../middlewares/validation'
import { createTeam, getAllTeams, getATeam, deleteTeam, addUsersToTeam } from './team_controllers'
import { isAdmin, isAuthenticated } from '../../../middlewares/auth'

const router = Router()

/**
 * team creation by admin
 * /api/v1/teams/new - POST
 */
router.post('/teams/new', validations.teamCreateRules(), validate, createTeam)

/**
 * view all teams by all users of the platform
 * /api/v1/teams?page=1&limit=10&search=wonderm - GET
 * optional query params
 */
router.get('/teams', getAllTeams)

/**
 * view a team
 * /api/v1/teams/:teamId - GET
 */
router.get('/teams/:teamId', validateTeamId, getATeam)

/**
 * delete a team - DELETE
 */
router.delete('/teams/:teamId', validateTeamId, deleteTeam)

/**
 * /api/v1/teams/add-user/:teamId
 * add users (mentees) <array> to a team - PUT
 * expects an array of menteeIds to be added
 */
router.put('/teams/add-user/:teamId', validateTeamId, validations.addMenteesToTeamRules(), validate, addUsersToTeam)

export default router
