import auth from './auth'

const menteeRouter = require('express').Router()

menteeRouter.use('/api/v1/mentees', auth)

export default menteeRouter
