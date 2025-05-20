const db = require("../config/db")
const validator = require('validator')
const bcrypt = require('bcrypt')

exports.registerPage = (req, res) => {
    res.render('user/register')
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
      'INSERT INTO users (phone_number, password) VALUES (?, ?)',
      [phone_number, hashedPassword]
    );

    return res.status(201).json({ message: "Conta criada com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};


exports.loginPage = (req, res) => {
    res.render('user/login')
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

        if (rows.length === 0) return res.status(400).json({ message: "Conta não encontrada verifique as informações enviadas ou Registre-se." });

        const user = rows[0]
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "Palavra passe está incorreta." });
        
        req.session.user = {id: user.id, phone_number: user.phone_number}
        return res.status(200).json({ message: "Sessão iniciada com sucesso." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }

}

exports.addDetailsPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM courses')
  const courses = rows.map(course => ({
    id:course.id,
    name: course.name
  }) )
  res.render('user/add-details', {courses: courses})
}

exports.addStudentDetails = async (req, res) => {
  res.status(200).json({message : 'ok'})
}

exports.addProfessorDetails = async (req, res) => {
  res.status(200).json({message : 'ok'})

}