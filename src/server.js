const { server } = require("./http");
const log = require("./utils/log");

require("./socket/main");

server.listen(process.env.PORT, function () {
  log("server", `listening on *:${process.env.PORT}`);
});
