const db  = require('../models/index')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.register = async (req, res) => {
    if ( req.method == 'POST') {
        const { phone_number, password } = req.body
        const isValidPhoneNumber = validator.isInt(phone_number)
        const isValidPassword = validator.isAlphanumeric(password)

        if (!phone_number || !password || !isValidPhoneNumber || !isValidPassword) {
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
            const user = await db.User.create({ phone_number, "password": hashedPassword })
            return res.status(201).json({
                'message': 'Usuário criado com sucesso',
                'args': {'user_id': user.id}
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
    if (req.method == 'POST') {
        const { phone_number, password } = req.body

        if (!phone_number || !password) {
            return res.status(400).json({
                'message': 'Informações inválidas'
            })
        }
        const user = await db.User.findOne( { where: { phone_number } })

        if (!user) {
            return res.status(400).json({
                'message': 'Usuário não encontrado'
            })
        }
        
        isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword){
            return res.status(400).json({
                'message': 'Senha incorrecta'
            })
        }

        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({
            'message': 'Login realizado com sucesso.',
            'token': token
        })
    } else {
        res.render('auth/login')
    }

}

exports.addDetails = async (req, res) => {
    courses = await db.Course.findAll()
    res.render('auth/add_details', { courses })
}

exports.registerStudent = async (req, res) => {
    
    const fields = Object.entries(req.body)
    
    for (const [key, value] of fields) {
        console.log(value)
        if (!value) {
            return res.status(400).json({
                'message': 'Informaçõdes inválidas'
            })
        }
    }

    try {
        await db.Student.create( {...req.body } )
        return res.status(200).json({
            'message': 'Informações salvas'
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            'message': 'Erro interno do sistema'
        })
    }
    
}