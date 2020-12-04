const express = require('express')
const passport = require('passport')
const { RegisterUser, Login, GetAllUsers, ForgotPassword, ResetPassword } = require('./auth_controllers')

const router = express.Router()

// auth
router.post('/users/register', RegisterUser)
router.post('/users/login', Login)
router.post('/users/forgot-password', ForgotPassword)
router.put('/users/reset-password', ResetPassword)

// users
router.get('/users/all', passport.authenticate('jwt', { session: false }), GetAllUsers)

export default router
