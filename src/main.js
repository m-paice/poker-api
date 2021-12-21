const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();

const routes = require("./routes");
const eventEmitter = require("./events");

const log = require("./utils/log");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const includeSocket = (req, res, next) => {
  req.io = io;

  next();
};

app.use(includeSocket);
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

io.on("connection", function (socket) {
  log("socket", "A user connected");

  eventEmitter.emit("new-user", socket);

  socket.on("vote", function (data) {
    console.log("[event-vote] =  ", data);
    eventEmitter.emit("vote", { socket: io, id: socket.id, vote: data.vote });
  });

  socket.on("reset", function () {
    console.log("[event-reset]");
    eventEmitter.emit("reset", { socket: io });
  });

  socket.on("start", function () {
    console.log("[event-start]");
    eventEmitter.emit("start", { socket: io });
  });

  socket.on("join", function (data) {
    console.log("[event-join] = ", data);
    eventEmitter.emit("join", {
      socket: io,
      id: socket.id,
      name: data.username,
    });
  });

  socket.on("remove", function (data) {
    console.log("[event-remove] = ", data);
    eventEmitter.emit("remove", { socket: io, id: data.id });
  });

  socket.on("disconnect", function () {
    log("socket", "A user disconnected");

    eventEmitter.emit("disconnected", { socket: io, id: socket.id });
  });
});

server.listen(process.env.PORT, function () {
  log("server", `listening on *:${process.env.PORT}`);
});
