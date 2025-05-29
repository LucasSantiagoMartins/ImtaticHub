const { isValidFutureDate } = require("../../date-validator");

function isAddTaskValidRequest(payload, callback){
    const {
        title,
        deliveryDate,
    } = payload;
    
    if (!title || !deliveryDate) {
        return callback("Informações obrigatórias estão em falta.")
    }

    if(!isValidFutureDate(deliveryDate, null)){
        return callback("A data de entrega deve ser posterior ao momento atual.")

    }
    return callback(null)
}

module.exports = {isAddTaskValidRequest}