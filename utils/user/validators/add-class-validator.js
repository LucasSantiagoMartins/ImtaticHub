
function isAddClassValidRequest(payload, callback){
    const {
        name,
        totalNumberStudents,
        period,
        course_id
    } = payload;
console.log(payload)
    
    if (!name || !totalNumberStudents || !period || !course_id) {
        return callback("Informações obrigatórias estão em falta.")
    }

    return callback(null)
}

module.exports = {isAddClassValidRequest}