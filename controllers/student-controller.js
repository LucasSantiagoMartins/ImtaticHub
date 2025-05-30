const db = require('../config/db');
const {handleSingleUpload} = require('../middleware/upload')
const fs = require('fs'); 

const mapEvents = (items, sourceType) => {
    if (!Array.isArray(items)) {
        console.warn(`mapEvents recebeu um tipo inválido para ${sourceType}:`, items);
        return []; 
    }

    return items.map(item => {
        let type = '';
        switch (sourceType) {
            case 'academic_task':
                type = item.type === 'work' ? 'trabalho' : 'tarefa';
                break;
            case 'exam':
                type = 'prova';
                break;
            default:
                type = 'evento'; 
        }

        const dueDate = item.delivery_date || item.exam_date;
        const formattedDueDate = dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : '';
        const formattedDueTime = item.exam_time ? item.exam_time.toString().substring(0, 5) : '';

        return {
            id: item.id,
            type, 
            title: item.title || item.discipline, 
            discipline: item.discipline || '',
            description: item.description || '',
            dueDate: formattedDueDate,
            dueTime: formattedDueTime,
            status: 'pendente' 
        };
    });
};

exports.getActivityPanelData = async (userId) => {
    const [studentResult] = await db.query(
        "SELECT class_id FROM students WHERE user_id = ?",
        [userId]
    );

    if (studentResult.length === 0) {
        throw new Error("Turma do aluno não encontrada.");
    }

    const classId = studentResult[0].class_id;

    const [academicTasksRaw, examsRaw, studyMaterialsRaw] = await Promise.all([
        db.query(`
            SELECT at.id, at.type, at.title, at.discipline, at.description, at.delivery_date
            FROM academic_tasks at
            JOIN academic_task_class atc ON at.id = atc.academic_task_id
            WHERE atc.class_id = ?
            ORDER BY at.delivery_date ASC
        `, [classId]),

        db.query(`
            SELECT e.id, 'prova' as type, e.discipline, e.description, e.exam_date
            FROM exams e
            JOIN exam_class ec ON e.id = ec.exam_id
            WHERE ec.class_id = ?
            ORDER BY e.exam_date ASC
        `, [classId]),

        db.query(`
            SELECT sm.id, sm.description, sm.discipline, sm.file, sm.created_at
            FROM study_materials sm
            JOIN study_material_class smc ON sm.id = smc.study_material_id
            WHERE smc.class_id = ?
            ORDER BY sm.created_at DESC
        `, [classId])
    ]);

    const mappedAcademicTasks = mapEvents(academicTasksRaw[0], 'academic_task');
    const mappedExams = mapEvents(examsRaw[0], 'exam');

    return {
        academicTasks: mappedAcademicTasks,
        exams: mappedExams,
        studyMaterials: studyMaterialsRaw[0] || [] 
    };
};



exports.activityPanelData = async (req, res) => {
    const user = req.session?.user;

    if (!user || !user.id) {
        return res.status(401).json({ message: "Sessão expirada. Faça login novamente." });
    }

    try {
        const data = await exports.getActivityPanelData(user.id);
        return res.json(data);
    } catch (err) {
        console.error("Erro ao obter dados do activityPanelData:", err.message);
        const status = err.message.includes("Turma do aluno não encontrada") ? 404 : 500;
        return res.status(status).json({ message: err.message });
    }
};

exports.activityPanel = async (req, res) => {
    const user = req.session?.user;

    if (!user || !user.id) {
        return res.render('student/activity-panel', {
            payloadData: [], 
            errorMessage: "Sessão expirada. Faça login novamente."
        });
    }

    try {
        const data = await exports.getActivityPanelData(user.id);
        return res.render('student/activity-panel', {
            payloadData: data, 
            errorMessage: null
        });
    } catch (err) {
        console.error("Erro ao renderizar o activityPanel:", err.message);
        return res.render('student/activity-panel', {
            payloadData: { academicTasks: [], exams: [], studyMaterials: [] }, 
            errorMessage: err.message || "Erro interno do sistema ao carregar o painel."
        });
    }
};

exports.submitAcademicTask = async (req, res) => {
    if (req.session.user.userGroup !== 'student') {
        return res.redirect('/usuarios/iniciar-sessao');
    }


    try {
        const file = await handleSingleUpload(req, res, 'file');

        const { description, academicTaskId } = req.body;

        const [rows] = await db.query(
            `SELECT * FROM academic_task_submissions WHERE academic_task_id = ? AND user_id = ?`,
            [academicTaskId, req.session.user.id]
        );

        if(rows.length !== 0)
            return res.status(400).json({ message: 'Já fizeste a submissão desta atividade.' });

        await db.query(
            `INSERT INTO academic_task_submissions
             (description, academic_task_id, document, user_id)
              VALUES (?, ?, ?, ?)`,
            [description, academicTaskId, file.filename, req.session.user.id]
        );

        return res.status(200).json({ message: 'Submisão realizada com sucesso.' });

    } catch (err) {
        console.error("Erro ao realizar a submisão:", err);

        if (file && file.path) {
            const filePath = file.path; 
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Erro ao remover arquivo temporário:", unlinkErr);
                } 
            });
        }

        return res.status(400).json({ message: 'Erro interno do sistema' });
    }
};
