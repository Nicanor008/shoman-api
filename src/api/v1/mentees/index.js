import { Router } from 'express'
import validations from './mentee_validation'
import { validate } from '../../../middlewares/validation'
import { applyForMentorship } from './mentee_controllers'

const router = Router()

/**
 * mentorship application for mentee
 */
router.post('/mentees/apply', validations.menteeApplyRules(), validate, applyForMentorship)

export default router
