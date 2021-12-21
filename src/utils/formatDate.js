const { format } = require("date-fns");

module.exports = (date) =>
  format(date, "dd/MM/yyyy HH:mm:ss", {
    timeZone: "America/Sao_Paulo",
  });
