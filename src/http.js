const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();

const routes = require("./routes");

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

module.exports = { server, io };
