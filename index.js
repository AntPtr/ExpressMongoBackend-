const http = require('http')
const config = require('./utilis/config')
const logger = require('./utilis/loggers')
const app = require('./app')

const server = http.createServer(app)

const PORT = config.PORT
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})