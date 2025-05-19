const express = require('express')
const userController = require('../controllers/user-controller')


const router = express.Router()

router.get('/usuarios/criar-conta', userController.registerPage)
router.post('/usuarios/criar-conta', userController.register)
router.get('/usuarios/iniciar-sessao', userController.loginPage)
router.post('/usuarios/iniciar-sessao', userController.login)
router.get('/usuarios/adicionar-informacoes', userController.addDetails)


module.exports = router