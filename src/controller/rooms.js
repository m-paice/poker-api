const uuid = require("uuid");

const Rooms = require("../models/rooms");

exports.index = () => {
  return Rooms;
};

exports.create = (data) => {
  const { name } = data;

  const payload = {
    id: uuid.v4(),
    name,
  };

  Rooms.push(payload);

  return payload;
};
