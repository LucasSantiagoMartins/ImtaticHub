
function isAddStudyMaterialValidRequest(payload, callback){
    const { title, discipline, file, classes } = payload;
    if (!title || !discipline || !file || !classes) {
        return callback("Informações obrigatórias estão em falta.")
    }
    return callback(null)
}

module.exports = {isAddStudyMaterialValidRequest}