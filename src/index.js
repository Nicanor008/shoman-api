const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const mongoose = require('mongoose')
const users = require('./routes/api/users')
import emailVerify from './routes/endpoints/users'
const YAML=require("yamljs")
const swaggerUi=require("swagger-ui-express")

const app = express()
const DB = require('./config/keys').mongoUri

// const swaggerDocument = YAML.load('docs/swagger.yaml');

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

// documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup('./docs/swagger.json'));

app.use('/api/v1/users', users)
app.use('/verify-email', emailVerify)
app.use('/', (req, res) => {
    return res.send('<p>Welcome to <b>Shoman Mentorship Platform.</b></p>')
})

const port = process.env.PORT || 4000
app.listen(port, () =>
    console.log(chalk.magenta(`server running on port ${port}`))
)
