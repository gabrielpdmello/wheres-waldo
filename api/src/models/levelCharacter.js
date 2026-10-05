const { prisma } = require("../lib/prisma.js");

class LevelCharacterModel {
  static async getLevelCharacters(levelId) {
    const characters = await prisma.level_character.findMany({
      where: {
        level_id: levelId,
      },
      include: {
        character: true,
      },
    });
    return characters;
  }

  static async getLevelCharacterById(levelId, characterId) {
    const character = await prisma.level_character.findMany({
      where: {
        level_id: levelId,
        character_id: characterId,
      },
      include: {
        character: true,
      },
    });
    return character[0];
  }
}

module.exports = LevelCharacterModel;
