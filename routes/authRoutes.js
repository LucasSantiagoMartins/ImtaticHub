const express = require('express')
const authControllers = require('../controllers/authController')


const router = express.Router()

router.get('/register-form', authControllers.registerForm)
router.post('/register', authControllers.register)
router.get('/login-form', authControllers.loginForm)
router.post('/login', authControllers.login)

module.exports = router