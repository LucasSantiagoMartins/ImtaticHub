const { isValidFutureDate } = require("../../date-validator");

function isAddAcademicTaskValidRequest(payload, callback){
    const {
        title,
        deliveryDate,
        type,
        discipline,
        classes
    } = payload;
    if(!classes)
        return callback("Selecione as turmas que vão receber essa atividade")
    if (!title || !deliveryDate || !discipline || !type) 
        return callback("Informações obrigatórias estão em falta.")
    if(!isValidFutureDate(deliveryDate, null))
        return callback("A data de entrega deve ser posterior ao momento atual.")

    return callback(null)
}

module.exports = {isAddAcademicTaskValidRequest}