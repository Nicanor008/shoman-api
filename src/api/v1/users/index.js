const express = require('express')
import { isAuthenticated } from '../../../middlewares/auth'
import { GetASingleUser, LoggedInUserDetails } from './user_controller'

const router = express.Router()

router.get('/users/current-user', isAuthenticated, LoggedInUserDetails)
router.get('/users/:id', GetASingleUser)

export default router
