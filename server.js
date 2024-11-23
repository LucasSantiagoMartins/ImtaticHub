require('dotenv').config()

const server = require('fastify')({
    logger: true
})

server.get('/', (req, reply) => {
    reply.send({message: 'Hello world'})
})

const port = process.env.PORT
server.listen({port: port}, (err, address) => {

    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    server.log.info(`Server is running on ${address}`)
})

