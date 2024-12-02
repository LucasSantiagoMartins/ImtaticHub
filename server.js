const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const path = require('path')
require('dotenv').config()


// settings
const app = express()
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/auth', authRoutes)

port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor rodando em localhost:${port}`)
})