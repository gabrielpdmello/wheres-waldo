const GameModal = require("../models/game");
const LevelModel = require("../models/level");
const LevelCharacterModel = require("../models/levelCharacter");
const jwt = require("jsonwebtoken");

class GameService {
  static async getGame(gameId) {
    const game = await GameModal.getGameById(gameId);

    if (!game) {
      const error = new Error("Game not found.");
      error.status = 404;
      throw error;
    }
    return game;
  }

  static async startGame(levelId) {
    const level = await LevelModel.getLevelById(levelId);

    if (!level) {
      const error = new Error("Level not found.");
      error.status = 404;
      throw error;
    }

    const game = await GameModal.createGame(levelId);
    return game;
  }

  static async find(gameId, xPos, yPos, characterId) {
    const game = await this.getGame(gameId);

    if (game.win_at) {
      const error = new Error(
        "Game is already won. Use the token to submit your score!",
      );
      error.status = 409;
      throw error;
    }

    const levelCharacters = await LevelCharacterModel.getLevelCharacters(
      game.level_id,
    );

    const character = levelCharacters.find(
      (c) => c.character_id === characterId,
    );

    character.name = character.character.name;
    delete character.character;

    const level = await LevelModel.getLevelById(game.level_id);
    const foundCharacters = game.found_characters;

    const x = character.pos[0];
    const y = character.pos[1];
    const errorMargin = level.marker_size / 100 / 2;

    if (xPos >= x - errorMargin && xPos <= x + errorMargin) {
      if (yPos >= y - errorMargin && yPos <= y + errorMargin) {
        if (foundCharacters.includes(character.character_id)) {
          const error = new Error(`${character.name} already found!`);
          error.status = 409;
          throw error;
        }
        foundCharacters.push(character.character_id);

        // check if all characters are found
        if (foundCharacters.length === levelCharacters.length) {
          const secret = process.env.SECRET_KEY;
          const token = jwt.sign({ gameId }, secret, {
            expiresIn: Number(process.env.GAME_JWT_EXPIRE || 900),
          });
          const winAt = new Date();
          const startAt = new Date(game.started_at);
          const time = winAt.getTime() - startAt.getTime();
          await GameModal.winGame(gameId, foundCharacters, time, winAt);

          const data = {
            message: `You found ${character.name}!`,
            character,
            gameWin: true,
            time,
          };

          data.token = token;

          return data;
        }

        await GameModal.addFoundCharacters(gameId, foundCharacters);
        const data = { message: `You found ${character.name}!`, character };

        return data;
      }
    }
    const error = new Error("Character not found!");
    error.status = 404;
    throw error;
  }
}

module.exports = GameService;
