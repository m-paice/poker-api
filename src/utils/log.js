const formatDate = require("./formatDate");

module.exports = (event = "", payload = "") => {
  console.log(
    `[${formatDate(new Date())}] - [${event}]::${JSON.stringify(
      payload,
      null,
      2
    )}`
  );
};
