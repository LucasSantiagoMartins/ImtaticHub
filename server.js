const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const session = require("express-session")
const flash = require('connect-flash')
const socialRoutes = require("./routes/social-routes")
const authRoutes = require("./routes/user-routes")

const app = express()
require('dotenv').config()

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
app.use('/', socialRoutes)
app.use('/', authRoutes)

port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})