const { io } = require("../http");

const Users = require("../models/users");

const userBySocket = new Map();

const getUser = (socketId) => Users.find((user) => user.id === socketId);

const getUserIndex = (socketId) =>
  Users.findIndex((user) => user.id === socketId);

const setUser = (socketId, payload) => {
  const user = getUser(socketId);
  const userIndex = getUserIndex(socketId);

  Users[userIndex] = {
    ...user,
    ...payload,
  };
};

io.on("connection", (socket) => {
  console.log(`A user connected [${socket.id}]`);

  Users.push({ id: socket.id });

  userBySocket.set(socket.id, socket);

  /**
   * Join in room
   */
  socket.on("join", (data) => {
    console.log("[join]::", data);
    socket.join(data.roomId);
  });

  /**
   * New user
   */
  socket.on("set_user", (data) => {
    console.log("[set_user]::", data);
    const payload = {
      id: socket.id,
      roomId: data.roomId,
      name: data.name,
      onlyView: data.onlyView,
    };

    setUser(socket.id, payload);

    socket.to(data.roomId).emit("new_user", payload);
  });

  /**
   * Disconnect Room
   */
  socket.on("disconnect", function () {
    const i = Users.findIndex((item) => item.id === socket.id);

    const payload = Users[i];

    console.log("a user disconnected: ", payload);

    if (payload && payload.roomId) {
      socket.to(payload.roomId).emit("disconnected", payload.id);
    }

    Users.splice(i, 1);
  });

  /**
   * Vote
   */
  socket.on("vote", (data) => {
    console.log("[vote]::", data);

    const i = Users.findIndex((item) => item.id === socket.id);

    const user = {
      ...Users[i],
      vote: data.vote,
    };

    Users[i] = user;

    socket.to(user.roomId).emit("voted", user);
  });

  /**
   * start game
   */
  socket.on("start", (data) => {
    const usersFromRoomId = Users.filter((user) => user.roomId === data.roomId);

    socket.to(data.roomId).emit("started", usersFromRoomId);
  });

  socket.on("reset", (data) => {
    socket.to(data.roomId).emit("reseted");
  });

  /**
   * remove user
   */
  socket.on("remove", (data) => {
    console.log("[remove]::", data);

    const socketForRemove = userBySocket.get(data.userId);
    socketForRemove.disconnect();
  });
});
