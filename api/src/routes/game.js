const { Router } = require("express");
const GameController = require("../controllers/game");

const router = Router();

router.post("/", GameController.startGame);
router.post("/:gameId/find", GameController.find);

module.exports = router;
