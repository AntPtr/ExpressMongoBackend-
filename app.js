const config = require('./utilis/config')
const mongoose = require('mongoose')
const logger = require('./utilis/loggers')
const express = require('express')
const cors = require('cors')
const blogRouters = require('./controllers/bloglists')
const middleware = require('./utilis/middlewares')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to Mongo')
    })
    .catch(error => {
        logger.error('failed connecting to Mongo', error.message)
    })


app.use('/api', middleware.userExtractor, blogRouters )
app.use('/api/users', userRouter)
app.use('/login', loginRouter)

app.use(middleware.unknowEndPoint)
app.use(middleware.errorHandler)

module.exports = app