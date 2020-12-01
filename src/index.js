const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const mongoose = require('mongoose')
import errorHandler from './utils/errorHandler'
const users = require('./api/v1/auth')
const tracks = require('./api/v1/tracks')
import emailVerify from './routes/endpoints/users'
import mentees from "./api/v1/mentees";

const app = express()
const DB = require('./config/keys').mongoUri

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

app.use(bodyParser.json())

app.use(morgan('dev'))

mongoose
    .connect(DB, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
    })
    .then(() =>
        console.log(chalk.greenBright('connection to the database successful'))
    )
    .catch((err) => console.log(err))

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    return mongoose.connect(DB, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
    })
}

mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`)
    setTimeout(connectWithRetry, 5000)
})

app.use('/api/v1/users', users)
app.use('/verify-email', emailVerify)
app.use('/api/v1/mentees', mentees);
app.use('/api/v1/tracks', tracks)
app.use('/', (req, res) => {
    return res.send(
        '<center><p>Welcome to <b>Shoman Mentorship Platform.</b></p><br />You can access endpoints on <i>https://shoman.herokuapp.com/api/v1/...</i> e.g. <u>https://shoman.herokuapp.com/api/v1/users/all</u></center>'
    )
})

// default error handler
app.use((err, req, res, next) => {
    console.error(
        `${err.status || 500} - ${req.method} - ${err.message}  - ${
            req.originalUrl
        } - ${req.ip}`
    )
    errorHandler(err, req, res, next)
})

const port = process.env.PORT || 4000
app.listen(port, () =>
    console.log(chalk.magenta(`server running on port ${port}`))
)
