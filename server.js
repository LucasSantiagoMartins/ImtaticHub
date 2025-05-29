const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const session = require("./config/session-config")
const flash = require('connect-flash')
const socialRoutes = require("./routes/social-routes")
const authRoutes = require("./routes/user-routes")
const eventRoutes = require("./routes/event-routes")
const adminRoutes = require("./routes/admin-routes")
const teacherRoutes = require("./routes/teacher-routes")
const cors = require('cors');

const app = express()
require('dotenv').config()
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(flash())
app.set('view engine', 'ejs')
app.use('/', socialRoutes)
app.use('/', authRoutes)
app.use('/eventos', eventRoutes)
app.use('/area-administrativa', adminRoutes)
app.use('/professor', teacherRoutes)


port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})