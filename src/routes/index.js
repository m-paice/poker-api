const { Router } = require("express");

const roomController = require("../controller/rooms");
const userController = require("../controller/users");

const router = Router();

router.get("/", (req, res) => res.sendStatus(200));

router.post("/rooms", (req, res) => {
  const response = roomController.create(req.body);

  return res.json(response);
});

router.get("/rooms", (req, res) => {
  const response = roomController.index();

  return res.json(response);
});

router.get("/users/:roomId", (req, res) => {
  const { roomId } = req.params;

  const response = userController.usersFromRoomId(roomId);

  return res.json(response);
});

module.exports = router;
