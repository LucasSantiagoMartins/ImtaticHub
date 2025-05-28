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

  const [year, month, day] = eventDate.split('-').map(Number);

  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return callback("Data inválida.");
  }

  const [hour = 0, minute = 0] = eventTime ? eventTime.split(':').map(Number) : [0, 0];

  const eventDateObj = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  if (isNaN(eventDateObj.getTime())) {
    return callback("Data e hora inválidas.");
  }

  if (eventDateObj <= now) {
    return callback("A data e hora do evento devem ser posteriores ao momento atual.");
  }

  return callback(null);
}


module.exports = {isAddEventValidRequest}