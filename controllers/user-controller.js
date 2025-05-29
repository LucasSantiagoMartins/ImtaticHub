const db = require("../config/db")
const validator = require('validator')
const bcrypt = require('bcrypt')
const {isAddStudentDetailsValidRequest} = require('../utils/user/validators/add-student-details-validator')
const {isAddTeacherDetailsValidRequest} = require('../utils/user/validators/add-teacher-details-validator')
const { isValidStudentBirthDate, isValidTeacherBirthDate } = require("../utils/user/validators/birth-date-validator")
exports.registerPage = (req, res) => {
    res.render('user/register')
}


exports.register = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const isValidPhoneNumber = validator.isMobilePhone(phoneNumber + '', 'any');
  const isValidPassword = validator.isAlphanumeric(password + '');

  if (!phoneNumber || !password || !isValidPhoneNumber || !isValidPassword) {
    return res.status(400).json({ message: "Informações inválidas." });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);

    if (results.length > 0)
    {
        return res.status(400).json({ message: "Este número de telefone já está sendo usado." });
    } 

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.query(
      'INSERT INTO users (phone_number, password) VALUES (?, ?)',
      [phoneNumber, hashedPassword]
    );

    const [rows] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber])
    const user = rows[0]
    req.session.user = {id: user.id, phoneNumber: phoneNumber}

    return res.status(201).json({ message: "Conta criada com sucesso.", redirectTo: "/usuarios/selecionar-perfil"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do sistema." });
  }
};


exports.loginPage = (req, res) => {
    res.render('user/login')
}

exports.login = async (req, res) => {
    const {phoneNumber, password} = req.body;
    const isValidPhoneNumber = validator.isMobilePhone(phoneNumber + '', 'any');
    const isValidPassword = validator.isAlphanumeric(password + '');

    if (!phoneNumber || !password || !isValidPhoneNumber || !isValidPassword) {
        return res.status(400).json({ message: "Informações inválidas." });
    }

    try {
         const [rows] = await db.query(
          `SELECT users.id, users.phone_number, users.password, user_groups.name AS user_group_name
          FROM users
          INNER JOIN user_groups ON users.user_group_id = user_groups.id
          WHERE users.phone_number = ?`,
          [phoneNumber]
        );


        if (rows.length === 0) {
          return res.status(400).json({
            message: "Conta não encontrada. Verifique as informações enviadas ou registre-se.",
          });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Palavra-passe incorreta." });
        }

        req.session.user = {
          id: user.id,
          phoneNumber: user.phone_number,
          userGroup: user.user_group_name
        };

        return res.status(200).json({ message: "Sessão iniciada com sucesso.", redirectTo: "/" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do sistema." });
    }

}

exports.chooseProfile = (req, res) => {
  res.render('user/choose-profile')
}

exports.addStudentDetailsPage = async (req, res) => {
  const [courses] = await db.query('SELECT id, name FROM courses')
  const [classes] = await db.query('SELECT id, name FROM classes')
  res.render("user/add-student-details", {courses: courses, classes: classes})
}

exports.addTeacherDetailsPage = (req, res) => {
  res.render("user/add-teacher-details")
}

exports.addTeacherDetails = async (req, res) => {
  if (!req.session.user){
    return res.status(401).json({message: "Você precisa iniciar sessão. Por favor, faça login para continuar."})
  }

  isAddTeacherDetailsValidRequest(req.body, async (err) =>{
    if (err){
      return res.status(400).json({message: err})
    }

    try{
      const userId = req.session.user.id
      const [rows] = await db.query('SELECT * FROM teachers where user_id = ?', [userId])
      
      if(rows.length !== 0){
        return res.status(400).json({message: "As suas informações já foram adicionadas."})
      }
      
      const {fullName, nationality, gender, address, birthDate} = req.body
      if(!isValidTeacherBirthDate(birthDate)){
          return res.status(400).json({message: "Professores devem ter no mínimo 18 anos de idade. Verifique se a data inserida está correta."})
      }

      const [teacherUserGroup] = await db.query("SELECT * FROM user_groups WHERE name = 'teacher' ")

      if(teacherUserGroup.length === 0){
        console.log("Grupo 'teacher' não encontrado");
        return res.status(500).json({ message: "Erro interno do sistema." });
      }
      
      await db.query(
        'UPDATE users SET user_group_id = ? WHERE id = ?',
        [teacherUserGroup[0].id, userId]
      );

      await db.query('INSERT INTO teachers (full_name,nationality,gender,address,birth_date,user_id) VALUES (?,?,?,?,?,?)', [fullName.toLowerCase(), nationality.toLowerCase(), gender, address.toLowerCase(), birthDate, userId])

      return res.status(200).json({message: "Informações adicionadas com sucesso.", redirectTo: "/usuarios/iniciar-sessao"})

    }catch(err){
      console.error(err)
      return res.status(500).json({ message: "Erro interno do sistema." });
    }
  })
  
}
exports.addStudentDetails = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Você precisa iniciar sessão. Por favor, faça login para continuar."
    });
  }

  isAddStudentDetailsValidRequest(req.body, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const userId = req.session.user.id;

      const [existingStudent] = await db.query('SELECT id FROM students WHERE user_id = ?', [userId]);
      if (existingStudent.length > 0) {
        return res.status(400).json({ message: "As suas informações já foram adicionadas." });
      }

      const {
        fullName = '',
        nationality = '',
        gender = '',
        address = '',
        classId = '',
        grade = '',
        registrationNumber = '',
        courseId = '',
        birthDate = '',
        academicYear = ''
      } = req.body;

      if (!isValidStudentBirthDate(birthDate)) {
        return res.status(400).json({
          message: "Alunos devem ter pelo menos 12 anos de idade para serem matriculados. Por favor, verifique a data informada."
        });
      }

      const [studentUserGroup] = await db.query("SELECT id FROM user_groups WHERE name = 'student'");
      if (studentUserGroup.length === 0) {
        console.error("Grupo 'student' não encontrado");
        return res.status(500).json({ message: "Erro interno do sistema." });
      }

      await db.query(
        'UPDATE users SET user_group_id = ? WHERE id = ?',
        [studentUserGroup[0].id, userId]
      );

      await db.query(`
        INSERT INTO students 
        (full_name, nationality, gender, address, grade, birth_date, academic_year, student_registration_number, course_id, class_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fullName.trim().toLowerCase(),
        nationality.trim().toLowerCase(),
        gender.trim().toLowerCase(),
        address.trim().toLowerCase(),
        grade.trim().toUpperCase(),
        birthDate,
        academicYear.trim(),
        registrationNumber.trim(),
        parseInt(courseId),
        (classId),
        userId
      ]);

      return res.status(200).json({
        message: "Informações adicionadas com sucesso.",
        redirectTo: "/usuarios/iniciar-sessao"
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno do sistema." });
    }
  });
};


exports.logout = async (req, res) => {
  if (!req.session.user){
    return res.status(400).json({message: 'Não tens sessão iniciada.'})
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao terminar sessão.'
      });
    }

    res.clearCookie('connect.sid'); 

    return res.status(200).json({
      success: true, 
      message: 'Sessão terminada com sucesso.',
      redirectTo: "/usuarios/iniciar-sessao"
    });
  });
};
