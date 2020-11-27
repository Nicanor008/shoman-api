import { Router } from 'express'
import validations from '../../validations/mentee'
import { validationMW } from '../../middlewares/validation'
import { applyForMentorship } from '../../controllers/mentee'

const router = Router()

/**
 * mentorship application for mentee
 */
router.post(
    '/apply',
    validations.menteeApplyRules(),
    validationMW,
    applyForMentorship
)

router.get('/ddd', (req, res) => {
    res.status(201).json({ msg: 'ggg' })
})

export default router
