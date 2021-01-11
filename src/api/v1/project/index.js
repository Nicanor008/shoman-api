const express = require('express')
import { CreateProjectController, GetProjectsController, getSingleProject } from './project_controllers'
import { isAuthenticated, isMentor } from '../../../middlewares/auth'

const router = express.Router()

router.post('/project', isMentor, CreateProjectController)
router.get('/projects', isAuthenticated, GetProjectsController)
router.get('/project/:projectId>', isAuthenticated, getSingleProject)

export default router
