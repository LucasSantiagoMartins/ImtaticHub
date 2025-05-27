const express = require('express')
const adminController = require('../controllers/admin-controller')
const router = express.Router()

router.get('/painel-geral', adminController.adminPage)
router.post('/adicionar-evento', adminController.addEvent)


module.exports = router;