const { prisma } = require("../lib/prisma.js");

class LeaderboardModel {
  static async getAllScores() {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: [{ level_id: "asc" }, { time: "asc" }],
    });
    return leaderboard;
  }

  static async getScoresByLevel(id) {
    const level = await prisma.level.findUnique({
      where: {
        id: id,
      },
    });

    if (!level) return null;

    const leaderboard = await prisma.leaderboard.findMany({
      where: {
        level_id: id,
      },
      orderBy: { time: "asc" },
    });
    return leaderboard;
  }

  static async addScore(name, levelId, time) {
    const score = await prisma.leaderboard.create({
      data: {
        name: name,
        level_id: levelId,
        time: time,
      },
    });

    return score;
  }
}

module.exports = LeaderboardModel;
