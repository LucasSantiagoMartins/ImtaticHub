const db  = require('../models/index')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registerForm = (req, res) => {
    res.render('auth/register')
}
exports.register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400).json({
            'error': 'Informações inválidas.'
        })
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({
            'error': 'E-mail inválido.'
        })
    }

    const existingUser = await db.User.findOne( { where: { email } })

    if (existingUser) {
        res.status(400).json({
            'message': 'Este E-mail já foi usado'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.User.create({ username, email, "password": hashedPassword })

    res.status(201).json({
        'message': 'Usuário criado com sucesso',
        'user': user
    })
}

exports.loginForm = (req, res) => {
    res.render('auth/login')
}
exports.login = async (req, res) => {
    const { email, password } = req.body

    const user = await db.User.findOne( { where: { email } })

    if (!user) {
        res.status(400).json({
            'error': 'Usuário não encontrado!'
        })
    }
    
    isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword){
        res.status(400).json({
            'error': 'Senha incorrecta!'
        })
    }


    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({
        'message': 'Login realizado com sucesso.',
        'token': tokencv 
    })
}