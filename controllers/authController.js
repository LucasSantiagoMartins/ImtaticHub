const db  = require('../models/index')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.register = async (req, res) => {
    if ( req.method == 'POST') {
        const { phone_number, password } = req.body

        if (!phone_number || !password) {
            return res.status(400).json({
                'message': 'Informações inválidas'
            })
        }        

        const existingUser = await db.User.findOne( { where: { phone_number } } )
        if (existingUser) {
            return res.status(400).json({
                'message': 'Este número já foi usado'
            })
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            await db.User.create({ phone_number, "password": hashedPassword })
            return res.status(201).json({
                'message': 'Usuário criado com sucesso'
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                'message': 'Erro interno do servidor!'
            })
        }
    
    }else{
        return res.render('auth/register')
    }
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