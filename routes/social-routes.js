const express = require('express')
const socialControllers = require('../controllers/social-controller.js')


const router = express.Router()

router.get('/', socialControllers.index)


module.exports = router