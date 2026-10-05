const { Router } = require("express");
const LeaderboardController = require("../controllers/leaderboard");

const router = Router();

router.get("/", LeaderboardController.getAllScores);
router.post("/", LeaderboardController.submitScore);

module.exports = router;
