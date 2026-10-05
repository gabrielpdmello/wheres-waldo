const GameService = require("../services/game");

class GameController {
  static async startGame(req, res) {
    const levelId = Number(req.body?.levelId);

    if (!levelId) {
      return res.status(400).json({
        message: "No level selected.",
      });
    }

    if (Number.isNaN(levelId)) {
      return res.status(400).json({
        message: "Level id must be a number.",
        levelId: req.body.levelId,
      });
    }

    const newGame = await GameService.startGame(levelId);

    return res.status(201).json({
      message: "Game start!",
      gameId: newGame.id,
    });
  }

  static async find(req, res) {
    const xPos = Number(req.body.xPos);
    const yPos = Number(req.body.yPos);
    const characterId = Number(req.body.characterId);
    const gameId = req.params.gameId;

    if (!xPos || !yPos || !characterId) {
      return res
        .status(400)
        .json({ message: "Fields are required: xPos, yPos, characterId." });
    }

    if (Number.isNaN(xPos) || Number.isNaN(yPos) || Number.isNaN(characterId)) {
      return res.status(400).json({
        message: "xPos, yPos and characterId must be numbers.",
        xPos: req.body.xPos,
        yPos: req.body.yPos,
        characterId: req.body.characterId,
      });
    }

    const data = await GameService.find(gameId, xPos, yPos, characterId);

    return res.status(200).json(data);
  }
}

module.exports = GameController;
