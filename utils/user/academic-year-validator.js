function isValidAcademicYear(year){
   const regex = /^\d{4}\/\d{4}$/;
  if (!regex.test(year)) return false;

  const [start, end] = year.split('/').map(Number);
  return end === start + 1;

}

module.exports = {isValidAcademicYear};