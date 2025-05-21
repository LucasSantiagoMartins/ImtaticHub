
function isAddTeacherDetailsValidRequest(payload, callback){
    const {
        fullName,
        nationality,
        gender,
    } = payload;

    if (!fullName || !nationality || !gender) {
        return callback("Informações obrigatórias estão em falta.")
    }

    return callback(null)
}

module.exports = {isAddTeacherDetailsValidRequest}