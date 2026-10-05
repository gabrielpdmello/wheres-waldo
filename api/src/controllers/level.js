const LevelService = require("../services/level");

class LevelController {
  static getAllLevels = async (req, res) => {
    const levels = await LevelService.getAllLevels();
    return res.status(200).json(levels);
  };

  static getLevelById = async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Id must be a number", id: req.params.id });
    }

    const level = await LevelService.getLevelById(id);

    if (!level) {
      return res.status(404).json({ message: "Level not found." });
    }
    return res.status(200).json(level);
  };

  static getLeaderboard = async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Id must be a number.", id: req.params.id });
    }

    const data = await LevelService.getScores(id);
    return res.status(200).json(data);
  };

  static getCharacters = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Id must be a number.", id: req.params.id });
    }
    const characters = await LevelService.getCharacters(id);

    return res.status(200).json(characters);
  };
}

module.exports = LevelController;
