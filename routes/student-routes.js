const express = require('express')
const studentController = require('../controllers/student-controller')


const router = express.Router()

router.get('/painel-atividades', studentController.activityPanel)

module.exports = router;