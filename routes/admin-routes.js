const express = require('express')
const adminController = require('../controllers/admin-controller')
const router = express.Router()

router.get('/painel-geral', adminController.adminPage)
router.post('/adicionar-evento', adminController.addEvent)
router.get('/buscar-todos-eventos', adminController.getEvents)
router.get('/eventos', adminController.eventsPage)
router.get('/turmas', adminController.classesPage)
router.post('/adicionar-turma', adminController.addClass)


module.exports = router;