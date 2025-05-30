const express = require('express')
const userController = require('../controllers/user-controller')


const router = express.Router()

router.get('/criar-conta', userController.registerPage)
router.post('/criar-conta', userController.register)

router.get('/iniciar-sessao', userController.loginPage)
router.post('/iniciar-sessao', userController.login)

router.get('/selecionar-perfil', userController.chooseProfile)


router.get('/adicionar-informacoes-estudante', userController.addStudentDetailsPage)
router.post('/adicionar-informacoes-estudante', userController.addStudentDetails)

router.get('/adicionar-informacoes-professor', userController.addTeacherDetailsPage)
router.post('/adicionar-informacoes-professor', userController.addTeacherDetails)
router.post('/logout', userController.logout)

module.exports = router