const { isValidFutureDate } = require("../../date-validator");

function isAddExamValidRequest(payload, callback){
    const {
        discipline,
        examDate,
        classes,
    } = payload;
    
    if(!classes)
        return callback("Selecione as turmas que vão receber essa atividade")
    if (!discipline || !examDate) 
        return callback("Informações obrigatórias estão em falta.")
    if(!isValidFutureDate(examDate, null))
        return callback("A data da prova deve ser posterior ao momento atual.")
    
    return callback(null)
}

module.exports = {isAddExamValidRequest}