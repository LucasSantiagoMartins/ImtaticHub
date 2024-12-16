const socialRoutes = require('./routes/socialRoutes')
const authRoutes = require('./routes/authRoutes')
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const express = require('express')
const path = require('path')

require('dotenv').config()


// settings
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } 
}))
app.use(bodyParser.json())
app.use(flash())
app.set('view engine', 'ejs')

// routes
app.use('/auth', authRoutes)
app.use('/', socialRoutes)

port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})