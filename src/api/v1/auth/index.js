const express = require('express')
const passport = require('passport')
const { RegisterUser, Login, GetAllUsers, ForgotPassword, ResetPassword } = require('./auth_controllers')

const router = express.Router()

// auth
router.route('/register').post(RegisterUser)
router.route('/login').post(Login)
router.route('/forgot-password').post(ForgotPassword)
router.route('/reset-password').post(ResetPassword)

// users
router.route('/').post(passport.authenticate("jwt", { session: false }), GetAllUsers)

module.exports = router
