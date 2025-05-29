const express = require('express')
const teacherController = require('../controllers/teacher-controller')


const router = express.Router()

router.get('/painel-atividades', teacherController.activityPanel)
router.post('/postar-tarefa', teacherController.addTask)
router.post('/marcar-prova', teacherController.addExam)
router.post('/enviar-material-estudo', teacherController.addStudyMaterial)



module.exports = router;