//@ts-check
import jwt from 'jsonwebtoken'
require('dotenv').config()

const Auth = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        return decoded
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
        })
    }
}

const roleHelper = (req, res, next, role) => {
    let currentUser = Auth(req, res)
    if (currentUser && currentUser.role == role) {
        req.userData = currentUser
        next()
    } else {
        return res.status(401).json({
            message: 'Auth failed',
        })
    }
}
const isAuthenticated = (req, res, next) => {
    try {
        let currentUser = Auth(req, res)
        req.userData = currentUser
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
        })
    }
}

const isAdmin = (req, res, next) => {
    roleHelper(req, res, next, 'admin')
}

const isUser = (req, res, next) => {
    roleHelper(req, res, next, 'user')
}

const isMentor = (req, res, next) => {
    roleHelper(req, res, next, 'mentor')
}

const isMentee = (req, res, next) => {
    roleHelper(req, res, next, 'mentee')
}

export { isAuthenticated, isAdmin, isUser, isMentor, isMentee }
