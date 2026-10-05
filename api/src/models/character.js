const { prisma } = require("../lib/prisma.js");

class CharacterModel {
  static async getLevelCharacters(levelId) {
    const characters = await prisma.character.findMany({
      where: {
        level_character: {
          some: {
            level_id: levelId,
          },
        },
      },
    });
    return characters;
  }
}

module.exports = CharacterModel
