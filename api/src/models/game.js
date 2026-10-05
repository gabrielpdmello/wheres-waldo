const { prisma } = require("../lib/prisma.js");

class GameModal {
  static async getGameById(id) {
    const game = await prisma.game.findUnique({
      where: {
        id: id,
      },
    });
    return game;
  }

  static async createGame(levelId) {
    const newGame = await prisma.game.create({
      data: {
        level_id: levelId,
      },
    });
    return newGame;
  }

  static async addFoundCharacters(gameId, foundCharacters) {
    await prisma.game.update({
      data: {
        found_characters: foundCharacters,
      },
      where: {
        id: gameId,
      },
    });
  }

  static async winGame(gameId, foundCharacters, time, winAt) {
    await prisma.game.update({
      data: {
        found_characters: foundCharacters,
        time: time,
        win_at: winAt,
      },
      where: {
        id: gameId,
      },
    });
  }
}

module.exports = GameModal;
