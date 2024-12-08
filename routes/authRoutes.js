const express = require('express')
const authControllers = require('../controllers/authController')


const router = express.Router()

router.get('/register', authControllers.register)
router.post('/register', authControllers.register)
router.get('/login', authControllers.login)
router.post('/login', authControllers.login)
router.get('/add-details', authControllers.addDetails)

module.exports = router