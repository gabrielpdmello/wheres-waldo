const CharacterModel = require("../models/character");
const LeaderboardModel = require("../models/leaderboard");
const LevelModel = require("../models/level");

class LevelService {
  static async getAllLevels() {
    const levels = await LevelModel.getAllLevels();
    return levels;
  }

  static async getLevelById(id) {
    const level = await LevelModel.getLevelById(id);

    if (!level) {
      const error = new Error("Level not found.");
      error.status = 404;
      throw error;
    }

    return level;
  }

  static async getScores(id) {
    const scores = await LeaderboardModel.getScoresByLevel(id);
    if (!scores) {
      const error = new Error("Level not found.");
      error.status = 404;
      throw error;
    }
    return scores;
  }

  static async getCharacters(levelId) {
    const level = await LevelModel.getLevelById(levelId);
    if (!level) {
      const error = new Error("Level not found.");
      error.status = 404;
      throw error;
    }
    const characters = await CharacterModel.getLevelCharacters(levelId);
    return characters;
  }
}

module.exports = LevelService;
