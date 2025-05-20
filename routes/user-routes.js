const express = require('express')
const userController = require('../controllers/user-controller')


const router = express.Router()

router.get('/usuarios/criar-conta', userController.registerPage)
router.post('/usuarios/criar-conta', userController.register)

router.get('/usuarios/iniciar-sessao', userController.loginPage)
router.post('/usuarios/iniciar-sessao', userController.login)

router.get('/usuarios/selecionar-perfil', userController.chooseProfile)


router.get('/usuarios/adicionar-informacoes-estudante', userController.addStudentDetailsPage)

router.get('/usuarios/adicionar-informacoes-professor', userController.addTeacherDetailsPage)
router.post('/usuarios/adicionar-informacoes-professor', userController.addTeacherDetails)


module.exports = router