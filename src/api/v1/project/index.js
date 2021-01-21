const express = require('express')
import { CreateProjectController, GetProjectsController, GetProjectController, UpdateProjectController, DeleteProjectController } from './project_controllers'
import { isAuthenticated, isMentor } from '../../../middlewares/auth'

const router = express.Router()

router.post('/projects', isMentor, CreateProjectController)
router.get('/projects', isAuthenticated, GetProjectsController)
router.get('/projects/:projectId', isAuthenticated, GetProjectController)
router.patch('/projects/:projectId', isMentor, UpdateProjectController)
router.delete('/projects/:projectId', isMentor, DeleteProjectController)

export default router
