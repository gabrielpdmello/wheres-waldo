const LeaderboardModel = require("../models/leaderboard");
const GameModel = require("../models/game")

class LeaderboardService {
  static async getAllScores() {
    const leaderboard = await LeaderboardModel.getAllScores();
    return leaderboard;
  }

  static async addScore(gameId, name) {
    const gameData = await GameModel.getGameById(gameId);
    const time = gameData.time;
    const score = await LeaderboardModel.addScore(
      name,
      gameData.level_id,
      time,
    );
    return score;
  }

  static async getScoresByLevel(levelId) {
    const scores = await LeaderboardModel.getScoresByLevel(levelId);
    return scores;
  }
}

module.exports = LeaderboardService;
