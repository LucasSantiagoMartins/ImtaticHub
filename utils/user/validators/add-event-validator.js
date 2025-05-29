const { isValidFutureDate } = require("../../date-validator");

function isAddEventValidRequest(payload, callback) {
  const {
    eventName,
    eventDate,
    eventTime,
    eventCategory
  } = payload;

  if (!eventName || !eventDate || !eventCategory) {
    return callback("Informações obrigatórias estão em falta.");
  }

  if (!isValidFutureDate(eventDate, eventTime)) {
    return callback("A data e hora do evento devem ser posteriores ao momento atual.");
  }

  return callback(null);
}


module.exports = {isAddEventValidRequest}