const express = require('express')
const authControllers = require('../controllers/authControllers')


const router = express.Router()

router.get('/usuarios/criar-conta', authControllers.registerPage)
router.post('/usuarios/criar-conta', authControllers.register)
router.get('/usuarios/iniciar-sessao', authControllers.loginPage)
router.post('/usuarios/iniciar-sessao', authControllers.login)
router.get('/usuarios/adicionar-informacoes', authControllers.addDetails)


module.exports = router