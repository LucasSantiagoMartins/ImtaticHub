
function isAddEventValidRequest(payload, callback){
    const {
        eventName,
        eventDate,
        eventCategory
    } = payload;

    if (!eventName  || !eventDate || !eventCategory) {
        return callback("Informações obrigatórias estão em falta.")
    }

    return callback(null)
}

module.exports = {isAddEventValidRequest}