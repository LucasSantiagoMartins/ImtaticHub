const db = require('../config/db')
const { isAddAcademicTaskValidRequest } = require('../utils/user/validators/add-academic-task-validator')
const { isAddExamValidRequest } = require('../utils/user/validators/add-exam-validator');
const { isAddStudyMaterialValidRequest } = require('../utils/user/validators/add-study-material-validator');
const {handleSingleUpload } = require('../middleware/upload')
const fs = require('fs'); 
const path = require('path'); 


exports.activityPanel = async (req, res) => {
    if (req.session.user?.userGroup !== 'teacher') {
        return res.redirect('/usuarios/iniciar-sessao');
    }

    try {
        // Query para Classes: Mantida como está, parece que você a usa para outra seção da página.
        const [classes] = await db.query(`
            SELECT classes.id, classes.name, classes.period, classes.total_number_students,
                   courses.name AS course_name
            FROM classes
            JOIN courses ON classes.course_id = courses.id
        `);

        const [academicTaskSubmissions] = await db.query(
            `SELECT
                ats.id AS submission_id,
                ats.description AS submission_description,
                ats.document,
                ats.created_at AS submission_date,                 
                at.id AS task_id,
                at.title AS task_title,
                at.discipline AS task_discipline,
                at.type AS task_type,
                at.delivery_date AS task_due_date, 
                
                s.id AS student_id,
                s.full_name AS student_full_name,
                
                c.id AS class_id,
                c.name AS class_name, 
                c.period AS class_period, 
                
                u.id AS user_id, -- ID do usuário (do aluno)
                u.phone_number AS student_phone_number 
            FROM
                academic_task_submissions ats
            JOIN
                academic_tasks at ON ats.academic_task_id = at.id
            JOIN
                users u ON ats.user_id = u.id
            JOIN
                students s ON u.id = s.user_id
            JOIN
                classes c ON s.class_id = c.id
            WHERE
                at.teacher_id = ?
            ORDER BY
                ats.created_at DESC`,
            [req.session.user.id]
        );


        return res.render('teacher/activity-panel', {
            classes: classes,
            submissions: academicTaskSubmissions
        });

    } catch (error) {
        console.error('Erro ao carregar o painel de atividades:', error);
        return res.status(500).send('Ocorreu um erro ao carregar o painel.');
    }
};

exports.addAcademicTask = (req, res) => {
    if (req.session.user.userGroup !== 'teacher') {
        return res.redirect('/usuarios/iniciar-sessao');
    }

    isAddAcademicTaskValidRequest(req.body, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [req.session.user.id]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Somente professores podem postar tarefas' });
        }

        const { title, description, deliveryDate, discipline, type, classes } = req.body;

        try {
            const [result] = await db.query(
                'INSERT INTO academic_tasks(title, description, delivery_date, discipline, type, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
                [title, description, deliveryDate, discipline, type, req.session.user.id]
            );

            const taskId = result.insertId;

            const classIds = Array.isArray(classes) ? classes : classes.split(',');
            if (classIds.length === 0 || classIds[0] === "") {
                throw new Error('Nenhuma turma selecionada.');
            }

            for (const classId of classIds) {
                await db.query(
                    'INSERT INTO academic_task_class (academic_task_id, class_id) VALUES (?, ?)',
                    [taskId, classId.trim()]
                );
            }

            return res.status(200).json({ message: type === 'task' ? 'Tarefa postada com sucesso.' : 'Trabalho postado com sucesso.' });


        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro interno do sistema." });
        }
    });
};

exports.addExam = (req, res) => {
    if (req.session.user.userGroup !== 'teacher') {
        return res.redirect('/usuarios/iniciar-sessao');
    }

    isAddExamValidRequest(req.body, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const [rows] = await db.query('SELECT * FROM teachers WHERE user_id = ?', [req.session.user.id]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Somente professores podem marcar prova' });
        }

        const { discipline, examDate, description, classes } = req.body;

        try {
            const [result] = await db.query(
                'INSERT INTO exams(discipline, exam_date, description, teacher_id) VALUES (?, ?, ?, ?)',
                [discipline, examDate, description, req.session.user.id]
            );

            const examId = result.insertId;

            const classIds = Array.isArray(classes) ? classes : classes.split(',');
            if (classIds.length === 0 || classIds[0] === "") {
                throw new Error('Nenhuma turma selecionada.');
            }

            for (const classId of classIds) {
                await db.query(
                    'INSERT INTO exam_class (exam_id, class_id) VALUES (?, ?)',
                    [examId, classId.trim()]
                );
            }

            return res.status(200).json({ message: 'Prova marcada com sucesso.' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro interno do sistema." });
        }
    });
};


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
