const db = require('../config/db')
const { isAddTaskValidRequest } = require('../utils/user/validators/add-task-validator')
const { isAddExamValidRequest } = require('../utils/user/validators/add-exam-validator');
const { isAddStudyMaterialValidRequest } = require('../utils/user/validators/add-study-material-validator');
const {handleSingleUpload } = require('../middleware/upload')
const fs = require('fs'); 
const path = require('path'); 



exports.activityPanel = async (req, res) => {
     if(req.session.user.userGroup !== 'teacher'){
    return res.redirect('/usuarios/iniciar-sessao')
  }
    const [classes] = await db.query(`
      SELECT classes.*, courses.name AS course_name
      FROM classes
      JOIN courses ON classes.course_id = courses.id
    `);
    return res.render('teacher/activity-panel', {classes: classes})
}

exports.addTask = (req, res) => {

     if(req.session.user.userGroup !== 'teacher'){
    return res.redirect('/usuarios/iniciar-sessao')
  }
    isAddTaskValidRequest(req.body, async (err) => {
        if (err){
            return res.status(400).json({message: err})
        }
        const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [req.session.user.id])
        if (rows.length === 0){
            return res.status(401).json({message: 'Somente professores podem postar tarefas'})
        }

        const {title, description, deliveryDate} = req.body

        try{
            await db.query('INSERT INTO tasks(title, description, delivery_date, teacher_id) VALUES(?,?,?,?)',[title, description, deliveryDate, req.session.user.id])
            return res.status(200).json({message: 'Tarefa postada com sucesso.'})
        }catch(err){
            console.error(err)
            return res.status(500).json({ message: "Erro interno do sistema." });
        }
    })
}

exports.addExam = (req, res) => {
    if(req.session.user.userGroup !== 'teacher'){
    return res.redirect('/usuarios/iniciar-sessao')
  }
    isAddExamValidRequest(req.body, async (err) => {
        if (err){
            return res.status(400).json({message: err})
        }
        const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [req.session.user.id])
        if (rows.length === 0){
            return res.status(401).json({message: 'Somente professores podem marcar prova'})
        }

        const {discipline, examDate, description} = req.body

        try{
            await db.query('INSERT INTO exams(discipline, exam_date, description, teacher_id) VALUES(?,?,?,?)',[discipline, examDate, description, req.session.user.id])
            return res.status(200).json({message: 'Prova marcada com sucesso.'})
        }catch(err){
            console.error(err)
            return res.status(500).json({ message: "Erro interno do sistema." });
        }
    })
}

exports.addStudyMaterial = async (req, res) => {
    if (req.session.user.userGroup !== 'teacher') {
        return res.redirect('/usuarios/iniciar-sessao');
    }

    let uploadedFile = null; 

    try {
        uploadedFile = await handleSingleUpload(req, res, 'file');
        const payload = { ...req.body, file: uploadedFile };
        
        await new Promise((resolve, reject) => {
            isAddStudyMaterialValidRequest(payload, (err) => {
                if (err) {
                    return reject(new Error(err)); 
                }
                resolve(); 
            });
        });

        const { title, description, discipline, classes } = req.body;
        const studyMaterialFilename = uploadedFile.filename; 

        const [result] = await db.query(
            'INSERT INTO study_materials (title, description, discipline, file) VALUES (?, ?, ?, ?)',
            [title, description, discipline, studyMaterialFilename]
        );

        const studyMaterialId = result.insertId;

        const classIds = Array.isArray(classes) ? classes : classes.split(',');

        if (classIds.length === 0 || classIds[0] === "") {
             throw new Error('Nenhuma turma selecionada.');
        }

        for (const classId of classIds) {
            await db.query(
                'INSERT INTO study_material_class (study_material_id, class_id) VALUES (?, ?)',
                [studyMaterialId, classId.trim()]
            );
        }

        return res.status(200).json({ message: 'Material de estudo adicionado com sucesso.' });

    } catch (err) {
        console.error("Erro ao adicionar material de estudo:", err);

        if (uploadedFile && uploadedFile.path) {
            const filePath = uploadedFile.path; 
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Erro ao remover arquivo temporário:", unlinkErr);
                } else {
                    console.log(`Arquivo ${filePath} removido com sucesso.`);
                }
            });
        }

        return res.status(400).json({ message: err.message || 'Erro interno do servidor ao adicionar material de estudo.' });
    }
};
