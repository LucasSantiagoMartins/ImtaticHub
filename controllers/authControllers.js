const db = require("../config/db")
const validator = require('validator')
const bcrypt = require('bcrypt')

exports.registerPage = (req, res) => {
    res.render('auth/register')
}


exports.register = async (req, res) => {
  const { phone_number, password } = req.body;

  const isValidPhoneNumber = validator.isMobilePhone(phone_number + '', 'any');
  const isValidPassword = validator.isAlphanumeric(password + '');

  if (!phone_number || !password || !isValidPhoneNumber || !isValidPassword) {
    return res.status(400).json({ message: "Informações inválidas." });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);

    if (results.length > 0)
    {
        return res.status(400).json({ message: "Este número de telefone já está sendo usado." });
    } 

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.query(
      'INSERT INTO users (phone_number, password, created_at) VALUES (?, ?, ?)',
      [phone_number, hashedPassword, new Date()]
    );

    return res.status(201).json({ message: "Conta criada com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};


exports.loginPage = (req, res) => {
    res.render('auth/login')
}

exports.login = async (req, res) => {
    const {phone_number, password} = req.body;
    const isValidPhoneNumber = validator.isMobilePhone(phone_number + '', 'any');
    const isValidPassword = validator.isAlphanumeric(password + '');

    if (!phone_number || !password || !isValidPhoneNumber || !isValidPassword) {
        return res.status(400).json({ message: "Informações inválidas." });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);

        if (rows.length === 0) return res.status(400).json({ message: "Não existe nenhuma conta associada a este número de telefone." });

        const user = rows[0]
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "Palavra passe está incorreta." });
        
        req.session.user = {id: user.id, phone_number: user.phone_number}
        return res.status(200).json({ message: "Sesão iniciada com sucesso." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }

}

exports.addDetails = (req, res) => {
    res.render('auth/add_details')
}