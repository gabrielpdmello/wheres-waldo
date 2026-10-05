const { Router } = require("express");
const LevelController = require("../controllers/level");

const router = Router();

router.get("/", LevelController.getAllLevels);
router.get("/:id", LevelController.getLevelById);
router.get("/:id/leaderboard", LevelController.getLeaderboard);
router.get("/:id/characters", LevelController.getCharacters);

module.exports = router;
