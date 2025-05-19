const express = require('express')
const socialControllers = require('../controllers/socialController')


const router = express.Router()

router.get('/', socialControllers.index)


module.exports = router