const express = require('express')
const adminController = require('../controllers/admin-controller')
const router = express.Router()

router.get('/painel-geral', adminController.adminPage)


module.exports = router;