const express = require('express')
const eventController = require('../controllers/event-controller')


const router = express.Router()

router.get('/', eventController.eventPage)

module.exports = router;