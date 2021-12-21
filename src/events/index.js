const eventEmitter = require("./eventemitter");

const Users = require("../models/users");

const instances = new Map();

eventEmitter.on("new-user", (data) => {
  instances.set(data.id, data);

  Users.push({ id: data.id, vote: null, name: "" });
});

eventEmitter.on("disconnected", (data) => {
  const { socket, id } = data;

  const userIndex = Users.findIndex((item) => item.id === id);

  const user = Users[userIndex];

  Users.splice(userIndex, 1);
  instances.delete(data.id);

  socket.emit("disconnected", { user });
});

eventEmitter.on("vote", (data) => {
  const { socket, id, vote } = data;

  const userIndex = Users.findIndex((item) => item.id === id);

  Users[userIndex] = { ...Users[userIndex], vote };

  const user = Users[userIndex];

  socket.emit("voted", { user });
});

eventEmitter.on("reset", (data) => {
  const { socket } = data;

  Users.forEach((item, index) => {
    Users[index] = { ...item, vote: null };
  });

  socket.emit("reseted");
});

eventEmitter.on("start", (data) => {
  const { socket } = data;

  socket.emit("started", { users: Users });
});

eventEmitter.on("join", (data) => {
  const { socket, id, name } = data;

  const userIndex = Users.findIndex((item) => item.id === id);

  Users[userIndex] = { ...Users[userIndex], name };

  socket.emit("joined", { users: Users });
});
eventEmitter.on("remove", (data) => {
  const { socket, id } = data;

  const userIndex = Users.findIndex((item) => item.id === id);

  const user = Users[userIndex];

  Users.splice(userIndex, 1);
  instances.delete(data.id);

  socket.emit("disconnected", { user });
});

module.exports = eventEmitter;
