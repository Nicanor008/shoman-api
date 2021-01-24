import { Router } from 'express'
import validations from './content_validation'
import { validate } from '../../../middlewares/validation'
import { createContent } from './content_controllers'

const router = Router()

/**
 * view all teams by all users of the platform
 * /api/v1/teams?page=1&limit=10&search=wonderm - GET
 * optional query params
 */
router.get('/contents', (req, res) => {
    res.json({msg: "testing"})
})

/**
 * create learning content by a mentor
 * /api/v1/contents - POST
 */
router.post('/contents', validations.createContentRules(), validate, createContent)

export default router
