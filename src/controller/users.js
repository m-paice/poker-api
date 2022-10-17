const uuid = require("uuid");

const User = require("../models/users");

exports.index = () => {
  return User;
};

exports.usersFromRoomId = (roomId) => {
  const response = User.filter((user) => user.roomId === roomId);

  return response;
};
