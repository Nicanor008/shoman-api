const express = require('express')
import { CreateProjectController, GetProjectsController, GetProjectController } from './project_controllers'
import { isAuthenticated, isMentor } from '../../../middlewares/auth'

const router = express.Router()

router.post('/projects', isMentor, CreateProjectController)
router.get('/projects', isAuthenticated, GetProjectsController)
router.get('/projects/:projectId>', isAuthenticated, GetProjectController)

export default router
