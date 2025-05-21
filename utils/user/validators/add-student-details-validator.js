const {isValidAcademicYear} = require('./academic-year-validator')

function isAddStudentDetailsValidRequest(payload, callback){
    const {
        fullName,
        nationality,
        gender,
        studentClass,
        grade,
        registrationNumber,
        courseId,
        academicYear
    } = payload;

     if (!fullName || !nationality || !gender  || !studentClass || !grade || !registrationNumber || !courseId || !academicYear) {
    return callback("Informações obrigatórias estão em falta.")
  }

    if (!isValidAcademicYear(academicYear)) {
        return callback("Ano académico inválido. Certifique-se de usar o formato correto, como 2023/2024.")
    }

    return callback(null)
}

module.exports = {isAddStudentDetailsValidRequest}