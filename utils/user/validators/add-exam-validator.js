const { isValidFutureDate } = require("../../date-validator");

function isAddExamValidRequest(payload, callback){
    const {
        discipline,
        examDate,
    } = payload;
    
    if (!discipline || !examDate) {
        return callback("Informações obrigatórias estão em falta.")
    }

    if(!isValidFutureDate(examDate, null)){
        return callback("A data da prova deve ser posterior ao momento atual.")
    }
    
    return callback(null)
}

module.exports = {isAddExamValidRequest}