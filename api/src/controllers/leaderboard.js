const passportGame = require("../middlewares/passportGame");
const LeaderboardService = require("../services/leaderboard");

class LeaderboardController {
  static async getAllScores(req, res) {
    const leaderboards = await LeaderboardService.getAllScores();
    return res.status(200).json(leaderboards);
  }

  static submitScore = [
    passportGame.authenticate("jwt", {
      session: false,
      assignProperty: "gameId",
    }),
    async (req, res) => {
      const name = req.body.name;
      const gameId = req.gameId;

      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }

      const score = await LeaderboardService.addScore(gameId, name);
      return res.status(201).json({ message: "score uploaded", score });
    },
  ];
}

module.exports = LeaderboardController;
