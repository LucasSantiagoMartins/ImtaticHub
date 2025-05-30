const express = require('express')
const studentController = require('../controllers/student-controller')


const router = express.Router()

router.get('/painel-atividades', studentController.activityPanel)
router.get('/painel-atividades-dados', studentController.activityPanelData)
router.post('/submeter-tarefa-trabalho', studentController.submitAcademicTask)


module.exports = router;